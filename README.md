# **Iot Consumer**

## **Related Projects**  

- **[IoT Producer](https://github.com/mahdijz5/iot-producer)** – The producer service that sends data to this consumer.  

## **Overview**

This project is built using **Domain-Driven Design (DDD)** principles with a **functional programming (FP)** approach. It follows **Clean Architecture**, ensuring separation of concerns and maintainability.

## **Tech Stack**

- **Framework:** NestJS
- **Architecture:**  DDD
- **Message broker:** RabbitMq
- **Database:** Mongodb
- **Validation & Parsing:** Functional Approach (**Don't parse validate**)
- **API Documentation:** Swagger

## **Core Principles & Design Decisions**

### **1. Domain-Driven Design (DDD)**

The project strictly follows **DDD principles**, ensuring the **repository layer only deals with domain entities** and not raw database models. This enforces domain logic integrity and separation of concerns.

### **2. Functional Programming (FP) Principles**

This project utilizes functional programming techniques, including:

- **Pure Functions:** Functions return the same output for the same input, avoiding side effects.
- **Immutability:** Objects are immutable wherever possible, ensuring better predictability.
 - **Composition Over Inheritance:** Small, composable functions replace deep class hierarchies.

### **3. Parsing vs Validation ("Don't Parse Validate")**

- **Parsing is separate from validation** to ensure data integrity.
- **Domain objects are assumed to be valid once created.**
- **Validation occurs at the application layer** before an entity enters the domain.
 
### **4. API Documentation & Monitoring**

- **Swagger** is used for API documentation.
  - Available at: `http://localhost:<port>/`docs
 

## **Installation & Setup**

1. Clone the repository:
   ```sh
   git clone <repo_url>
   cd <project_folder>
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure environment variables in `.env`.
 
4. Start the application:
   ```sh
   npm run start:dev 
   ```
5. Run unit-testing:
   ```sh
   npm run test 
   ```


## **Conclusion**

This project showcases a practical implementation of **DDD, functional programming**. It ensures **high maintainability, reliability, and efficient handling of domain logic**.

