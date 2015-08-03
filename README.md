swipe on what you like, and we reveal to you stats about yourself

Tutorials used:
https://scotch.io/tutorials/angular-routing-using-ui-router
https://scotch.io/tutorials/how-to-correctly-use-bootstrapjs-and-angularjs-together


Problems and how they were overcome:

-Different image sizes, with the cards on the back being bigger.
--Being "tinder-like", we wanted swipe/dragging to reveal the card behind it. So the card in the back is actually always visible, but if the image sizes were different the card in the back would show up even if the card in the front wasn't dragged out of the way.
--Solution was to use set width and height in CSS with vw, vh:
http://stackoverflow.com/questions/20590239/maintain-aspect-ratio-of-div-but-fill-screen-width-and-height-in-css