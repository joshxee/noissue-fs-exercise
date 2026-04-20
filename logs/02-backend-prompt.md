User: Create a prompt to implement the backend portion of the exercise in the instructions, the prompt should tell the agent to do the following: architect the solution first, following best practices. Then use in memory sql lite database with drizzle for db access. The db should be seeded with the data from the example cart.json file.

The implementation should focus on the minimum implementation to satisfy the functional criteria, with a focus on clean code and unit testing

GitHub Copilot: ## Prompt

Implement the backend portion of the noissue ordering exercise.

1. Architect the solution first.
   - Design a clean, minimal backend that satisfies the functional criteria.
   - Identify the required services, routes, data models, and layers.
   - Prefer separation of concerns, small functions, and readable structure.

2. Use an in-memory SQLite database accessed through Drizzle ORM.
   - Define the database schema for suppliers, products, cart items, shipping fees, and generated purchase orders.
   - Seed the database from the provided cart.json example file.

3. Implement the minimum backend functionality needed:
   - A checkout endpoint that reads the seeded cart and generates one purchase order per supplier.
   - The purchase orders must include supplier-specific products, item totals, shipping fee, and order total.
   - Ensure the backend can return the generated purchase orders via an API.

4. Focus on clean code and unit testing.
   - Keep implementation simple and maintainable.
   - Cover core business logic with unit tests.
   - Avoid unnecessary extra features beyond the required functionality.