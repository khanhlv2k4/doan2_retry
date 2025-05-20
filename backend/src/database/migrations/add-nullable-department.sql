-- Make department column nullable
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS department VARCHAR(100) NULL;
