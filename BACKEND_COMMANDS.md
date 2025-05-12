# Backend Commands

## Node.js/Express Backend

```bash
# Navigate to backend directory
cd d:\zalo\doan2_end\backend

# Install dependencies (first time)
npm install

# Run in development mode
npm run dev

# Or start in production mode
npm start
```

## Python Backend

```bash
# Navigate to backend directory
cd d:\zalo\doan2_end\backend

# Create virtual environment (first time)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies (first time)
pip install -r requirements.txt

# Run Flask app
flask run
# OR for Django
python manage.py runserver
```

## Java/Spring Boot Backend

```bash
# Navigate to backend directory
cd d:\zalo\doan2_end\backend

# Build with Maven
mvn clean install

# Run the application
mvn spring-boot:run
# OR with the JAR file
java -jar target/app-name.jar
```

## Database Setup
Based on the SQL schema in README.md, you'll need PostgreSQL installed:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE doan2_end;

# Connect to the database
\c doan2_end

# Run the SQL schema from README.md
# You can copy the SQL commands from README.md into a file and run:
psql -U postgres -d doan2_end -f schema.sql
```

## Docker (if containerized)
```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f
```

## Troubleshooting Common Errors

### 1. Cannot find module './controllers/...' or './services/...'
- Ensure the file exists at the correct path.
- If missing, generate with:
  ```bash
  nest g resource <module-name>
  ```
- Check import names and file names for typos and correct casing.

### 2. Cannot find module 'class-validator', 'class-transformer', '@nestjs/swagger'
- Install missing dependencies:
  ```bash
  npm install class-validator class-transformer @nestjs/swagger
  ```
- If still failing, clean and reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

### 3. Property ... does not exist on type ... / Object literal may only specify known properties
- Use the correct property names as defined in your DTOs/entities (usually snake_case).

### 4. Export/Import Name Mismatch
- Use the exact exported class name (case-sensitive).

### 5. Swagger Decorator: 'additionalProperties' is missing
- Add `additionalProperties: true` to `@ApiPropertyOptional` or `@ApiProperty` for object types.

### 6. TypeScript: Wrong DTO/Entity Property Names
- Always use the property names as defined in your DTO/entity.

### 7. Repository create/save: Only use defined fields
- Only pass properties that exist in the entity.

### 8. General Steps to Fix and Prevent Errors
- Regenerate missing resources:
  ```bash
  nest g resource <module>
  ```
- Clean and rebuild:
  ```bash
  rm -rf dist node_modules package-lock.json
  npm install
  npm run build
  ```
- Keep naming consistent (prefer snake_case for DB, DTO, entity).
- Always check import/export names and casing.
