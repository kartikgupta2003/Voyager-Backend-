const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "User" ,
        required : true ,
    } ,
    destination : {
        type : String ,
        required: true 
    } ,
    budget : {
        type : String ,
        required : true 
    } ,
    duration : {
        type : Number ,
        required : true ,
    } ,
    noOfPeople : {
        type : String ,
        require : true 
    } ,
    hotelOptions : [
        {
            address : String ,
            description : String ,
            latitude : Number ,
            longitude : Number ,
            HotelName : String ,
            imageUrl : String ,
            pricePerNight : String ,
            rating : Number 
        }
    ] ,
    itinerary : [
        {
            dayNumber : Number ,
            plan : [{
                placeName : String ,
                displayName : String ,
                placeImageUrl : String ,
                bestTimeToVisit : String ,
                lat : Number ,
                long : Number ,
                placeDetails : String ,
                ticketPricing : String ,
                timeToTravel : String 
            }]
        }
    ] , 
    displayImg : {
        type:String 
    }
});

const Trip = mongoose.model("Trip" , tripSchema);
module.exports = Trip;
