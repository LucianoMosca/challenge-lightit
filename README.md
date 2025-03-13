# challenge-lightit

Disclaimer: Even though I understand that the preferred technology for this challenge's backend is Laravel, due to the very short time window for this challenge and my extremely tight personal schedule, I decided to go with Node for the backend (since I know more about Node than what I know about Laravel), there is also space for improvement on the UI due to the above mentioned time conditions. However, I would gladly refactor this project’s backend into Laravel and enhace the user interface if I could have a couple of weeks to learn and fully immerse myself in proper Laravel training :)
I also understand the gitflow used in this project is somewhat rudimentary and the commits were quite big or even unorganized, again, due to my lack of available free time.

Besides all of this, this challenge was quite fun!

Known Issues:
- Even though the images are being correctly stored, there is an issue (probably a path issue) when trying to retrieve them and show them on the UI


# The challenge's requirements:

Your goal is to create a patient registration application using Laravel & React, as the recommended techs for this challenge, but you can use other techs such as Go, Node, or Python.
You should implement the following functionalities:

# Backend:
* An API with a patient registration that requests the following information:
  - Full name
  - Email address
  - Phone number
  - Photo of the document.
* The application should validate the user-entered data, ensuring all required fields are provided and valid as appropriate.
* Email addresses should be unique.
* Once the patient's data has been validated, it should be stored in a PostgreSQL database.
* After a patient has been successfully registered, a confirmation email should be sent asynchronously to avoid blocking the application (it is unnecessary to design the email, use the framework's default template or a simple one).
* Use Docker to set up the development environment for the application.

# Frontend
- Layout a screen where patients' cards can be displayed (in any way you want). 
- A patient card must be expandable, where you can initially see the name and document photo, but when expanded you will see the rest. 
- Somewhere in the screen should be an Add Patient Button, and also handle empty & loading states.
- Layout a form that accepts the full name, email, phone number and document photo.
- The phone number should be composed of two fields. One for the country characteristic (ex: +598) and another one for the actual number.
- This form should also validate user input.
- Full name should only accept letters.
- Email address should only accept  @gmail.com  addresses.
- The document photo field will have to be drag n' drop capable, and will only accept .jpg images.
- In the event of a validation error; show in each field a message below the input. Ideal, with an animation. Errors must be displayed once you try to submit the data.
- When data is submitted, the different possible states of the messages must be taken into account. All these states must be in a modal, with an animation.
  * Error state
  * Success state
- Every time a patient is added successfully, the patients list should be refreshed automatically.
- Keep in mind the following additional points:
  * You can use Laravel's structure, conventions, and best practices that you consider best for organizing your code.
  * Frontwise; showcase you organization skills, your own styling methods, domain of the selected tech, domain at making reusable components, usage of standard industry-accepted tooling (TypeScript, linting, formatters), etc...
  * You must ensure that your application runs correctly in some way.
  * Avoid using UI libraries such as shadCN or MaterialUI, and we want to know how good you are at making components from the ground up, we are ok with primitives libraries.
  * (Laravel) Make sure to use Laravel's validation to verify the user-entered data.
  * Use a PostgreSQL database to store the patient data.
  * Develop the product with the understanding that the client will want SMS notifications within two months.
  * It is not necessary to configure a real email server. You can use a library like "Mailtrap" to test email sending in a development environment.
  * Use Docker to create a consistent and reproducible development environment.
  * You need to upload into Github repository and shared with the People team.
    
# Disclaimer
Remember not to use your name in the source code to keep the process & reviewing as anonymous as possible.
* FAQ
Can I use another tech that's not Laravel / React?: Yes! Of course, just let us know and we'll take it into account. Laravel and React are our preferred technologies but they are not exclusive
