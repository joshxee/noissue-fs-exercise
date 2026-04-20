# Practical exercise - build an ordering app

This practical exercise is to be completed by candidates applying for full stack development roles. It is intended
to allow the candidate to demonstrate their basic coding skills with some open-ended opportunities to add their own
touches. Completeness is not a requirement as the candidate will have an opportunity to discuss what the next steps
and areas of focus would be if this were a real project.

## Exercise requirements
The high level goal of this exercise is to build a small mockup of a web ecommerce checkout experience. Both the backend
services and frontend will need to be built. The candidate's app should be able to display the contents of a customer cart,
allow submitting the cart for checkout, and display a checkout confirmation page. 

### Functional requirements
* In this repository we have included a `cart.json` data file. This data describes the contents of a hypothetical customer cart.
    * The cart contains 6 products from 4 different suppliers.
    * The product prices and shipping prices have been separated and defined in NZD

* When a cart is checked out, the backend needs to create one purchase order per supplier with the applicable products for that supplier.

* There should be a minimum of four parts delivered. The candidate may add additional features they consider useful but there is no expectation of extra work:
    * A checkout page that displays the contents of the cart.
    * A 'Submit' button on the checkout page, that submits a request to the backend checkout API.
    * A backend endpoint that returns the purchase orders generated from a completed checkout. 
    * A confirmation page that displays the purchase orders created.

### Non-functional requirements
* The candidate may choose any backend and frontend technologies they are comfortable with or want to try out. We will discuss technology choices in the exercise review. 
* The candidate should provide instructions on how to access their code and any specifics to allow us to build and
  deploy the project in our local environment.
* The candidate should complete the exercise within a week of being invited to attempt it.
