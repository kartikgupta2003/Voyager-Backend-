const asyncHandler = require("express-async-handler");
const genAI = require("../Config/Gemini.js");
const Trip = require("../Models/tripModel.js");
const User = require("../Models/userModel.js");
const axios = require("axios");
const { clerkClient } = require("@clerk/clerk-sdk-node");


const createTrip = asyncHandler(async(req,res,next)=>{
    const {location , duration , people , budget , preferences} = req.body;

    // console.log("Trip controller me to phuc gyaa")

    try{
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
        const prompt = `Generate a travel plan in STRICT JSON format following this exact structure:

{
  "destination": "<string>",
  "budget": "<string>",
  "duration": <number>,
  "noOfPeople": "<string>",
  "hotelOptions": [
    {
      "HotelName": "<string>",
      "address": "<string>",
      "description": "<string>",
      "latitude": <number>,
      "longitude": <number>,
      "imageUrl": "<string>",
      "pricePerNight": "<string>",
      "rating": <number>
    }
  ],
  "itinerary": [
    {
      "dayNumber": <number>,
      "plan": [
        {
          "placeName": "<REAL location name ONLY, e.g. 'Haridwar', 'Rishikesh', 'Kedarnath Temple', 'Guptkashi'>",
          "displayName": "<Human-friendly description like 'Arrival at Haridwar and transfer to Guptkashi'>",
          "placeImageUrl": "<string>",
          "bestTimeToVisit": "<string>",
          "lat": <number>,
          "long": <number>,
          "placeDetails": "<string>",
          "ticketPricing": "<string>",
          "timeToTravel": "<string>"
        }
      ]
    }
  ]
}

Now generate the JSON output for:
Destination: ${location}
Duration (days): ${duration}
People: ${people}
Budget: ${budget}

Rules:
- placeName MUST be the official real-world location name ONLY. No sentences, no descriptions.
- Use displayName for descriptive text.
- DO NOT add any extra fields not present in the schema.
- All numeric fields must be valid numbers (not strings).
- All arrays must contain at least 2–3 items.
- The output MUST be valid JSON only (no explanation, no text outside JSON).
- Ensure latitude/longitude are realistic coordinates.

Also consider the user preferences: ${preferences}
`;
        const result = await model.generateContent(prompt);
        let text = result.response.text();
        text = text.replace(/```json|```/g, "").trim();

        let answer;
        try {
            answer = JSON.parse(text);
        } catch {
            answer = { raw: result.response.text() }; // fallback if not valid JSON
        }

        // console.log(answer);

        const clerkId = req?.auth?.userId; 
        const clerkUser = await clerkClient.users.getUser(clerkId);
        // console.log(clerkUser);
        const email = clerkUser.emailAddresses[0].emailAddress;

        // console.log("email hai " , email);

        const user = await User.findOne({email : email});


        // console.log("user is " , user);


        const trip = await Trip.create({
            userId : user?._id,
            destination : answer.destination ,
            budget : answer.budget ,
            duration : answer.duration ,
            noOfPeople : people ,
            hotelOptions : answer.hotelOptions ,
            itinerary : answer.itinerary
        });

        await User.findByIdAndUpdate(user?._id , { $push : {trips : trip._id}} , {new: true});

        return res.send(trip);

    } catch(err){
      // console.log(err);
        const error = new Error("AI service failed!");
        // console.log(err);
        next(err);
    }
})

const fetchTrip = async(req,res,next)=>{
  const {id} = req.body;

  try{
    const trip = await Trip.findById(id);

    if(!trip){
      const error = new Error("Trip not found !");
      error.status = 400;
      throw error;
    }
    res.send(trip);

  }catch(err){
    next(err);
  }
}

const fetchAllTrips = async(req,res , next)=>{
  const {userId} = req.body;
  
  try{
    const allTrips = await Trip.find({userId});

    res.send(allTrips);
  }catch(err){
    const error = new Error("Some error occured while fetching trips !");
    next(err);
  }
}

const getPhoto = async(req,res,next)=>{
  try {
    const { name, lat, lng } = req.query;
    const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
    const MAPTILER_KEY = process.env.MAPTILER_KEY;

    let keywords = [];

    // 1 — Add raw name as fallback
    if (name) keywords.push(name);

    // 2 — Reverse geocode if lat/lng exist
    if (lat && lng) {
      const geoURL = `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${MAPTILER_KEY}`;
      
      let geoRes;
      try {
        geoRes = await axios.get(geoURL);
      } catch (err) {
        // console.log("MapTiler error:", err.response?.data || err.message);
      }

      const props = geoRes?.data?.features?.[0]?.properties;

      if (props) {
        if (props.city) keywords.push(props.city);
        if (props.town) keywords.push(props.town);
        if (props.region) keywords.push(props.region);
        if (props.state) keywords.push(props.state);
        if (props.country) keywords.push(props.country);
      }
    }

    // 3 — Clean keywords (remove duplicates + empty)
    keywords = [...new Set(keywords)].filter(k => k && k.length > 2);

    // console.log("Searching Unsplash for:", keywords);

    const searchUnsplash = async (q) => {
      const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=1`;
      const res = await axios.get(url);
      return res.data.results?.[0]?.urls?.regular || null;
    };

    // 4 — Try each keyword until one image is found
    for (let q of keywords) {
      const img = await searchUnsplash(q);
      if (img) {
        return res.json({ imageUrl: img, keywordUsed: q });
      }
    }

    // Final fallback
    return res.json({ imageUrl: null, message: "No image found" });

  } catch (err) {
    // console.log("PHOTO ERROR:", err);
    return res.status(500).json({ error: "Server Error", message: err.message });
  }
}

module.exports={
    createTrip ,
    fetchTrip ,
    getPhoto ,
    fetchAllTrips
} 