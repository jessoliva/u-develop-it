-- by running source db/schema.sql, it runs this command and creates the table!

DROP TABLE IF EXISTS candidates;
DROP TABLE IF EXISTS parties;
-- As noted previously, the order of table creation is vital due to the dependency of the candidates table on the existence of a parties.id. In the same regard, the candidates table must be dropped before the parties table due to the foreign key constraint that requires the parties table to exist.
DROP TABLE IF EXISTS voters;

CREATE TABLE parties (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT
);
-- TEXT data type used for description because VARCHAR data type must declare a limit on the length

CREATE TABLE candidates (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  party_id INTEGER,
  industry_connected BOOLEAN NOT NULL,
  CONSTRAINT fk_party FOREIGN KEY (party_id) REFERENCES parties(id) ON DELETE SET NULL
);
-- constraint. This allows us to flag the party_id field as an official foreign key and tells SQL which table and field it references. In this case, it references the id field in the parties table. This ensures that no id can be inserted into the candidates table if it doesn't also exist in the parties table
-- Because this constraint relies on the parties table, the parties table MUST be defined first before the candidates table
-- Because we've established a strict rule that no candidate can be a member of a party that doesn't exist, we should also consider what should happen if a party is deleted --> we added ON DELETE SET NULL to tell SQL to set a candidate's party_id field to NULL if the corresponding row in parties is ever deleted.

CREATE TABLE voters (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  email VARCHAR(50) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
--  we added a new field, created_at, with a data type of DATETIME. In SQL, a DATETIME field's value will look something like 2020-01-01 13:00:00
-- That probably doesn't seem very user-friendly, but the front-end team can take that value, convert it with JavaScript's Date() constructor, and display anything they want at that point
-- DEFAULT: If you don't specify NOT NULL, then a field could potentially be NULL if that value isn't provided in an INSERT statement. With DEFAULT, however, you can specify what the value should be if no value is provided
-- CURRENT_TIMESTAMP: This will return the current date and time in the same 2020-01-01 13:00:00 format. Note that the time will be based on what time it is according to your server, not the client's machine
-- So, in our code we're specifying CURRENT_TIMESTAMP as the value for DEFAULT