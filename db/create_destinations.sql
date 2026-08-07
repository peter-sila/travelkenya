-- Create destinations table if it doesn't exist
CREATE TABLE IF NOT EXISTS destinations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  location VARCHAR(100),
  rating FLOAT DEFAULT 0,
  image VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Optionally insert a sample destination if table is empty
INSERT INTO destinations (title, location, rating, image, description)
SELECT 'Maasai Mara', 'Narok', 4.8, 'maasai_mara.jpg', 'Famous safari destination' 
WHERE NOT EXISTS (SELECT 1 FROM destinations LIMIT 1);
