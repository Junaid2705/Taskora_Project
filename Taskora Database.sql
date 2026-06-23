create database taskora_db;
use taskora_db;
CREATE TABLE users ( 
user_id BIGINT PRIMARY KEY AUTO_INCREMENT, 
full_name VARCHAR(150), 
username VARCHAR(100) UNIQUE, 
email VARCHAR(150) UNIQUE, 
mobile VARCHAR(20), 
password VARCHAR(255), 
role ENUM('ADMIN','EMPLOYER','FREELANCER','CREATOR'), 
email_verified BOOLEAN DEFAULT FALSE, 
status ENUM('ACTIVE','INACTIVE','BLOCKED') DEFAULT 'ACTIVE', 
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

CREATE TABLE user_profiles ( 
profile_id BIGINT PRIMARY KEY AUTO_INCREMENT, 
user_id BIGINT, 
headline VARCHAR(255), 
bio TEXT, 
skills TEXT, 
experience TEXT, 
education TEXT, 
country VARCHAR(100), 
state VARCHAR(100), 
city VARCHAR(100), 
avatar VARCHAR(255), 
cover_image VARCHAR(255), 
website VARCHAR(255), 
linkedin VARCHAR(255), 
github VARCHAR(255), 
FOREIGN KEY(user_id) REFERENCES users(user_id) 
);

CREATE TABLE categories ( 
category_id BIGINT PRIMARY KEY AUTO_INCREMENT, 
category_name VARCHAR(150), 
description TEXT, 
status BOOLEAN DEFAULT TRUE 
);

CREATE TABLE jobs ( 
job_id BIGINT PRIMARY KEY AUTO_INCREMENT, 
employer_id BIGINT, 
category_id BIGINT, 
title VARCHAR(255), 
description LONGTEXT, 
skills_required TEXT, 
budget DECIMAL(12,2), 
experience_required VARCHAR(100), 
location VARCHAR(150), 
deadline DATE, 
status ENUM('OPEN','CLOSED'), 
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
FOREIGN KEY(employer_id) REFERENCES users(user_id), 
FOREIGN KEY(category_id) REFERENCES categories(category_id)
);

CREATE TABLE job_applications ( 
application_id BIGINT PRIMARY KEY AUTO_INCREMENT, 
job_id BIGINT, 
freelancer_id BIGINT, 
cover_letter LONGTEXT, 
resume_url VARCHAR(255), 
status ENUM('PENDING','SHORTLISTED','REJECTED','HIRED'), 
applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
FOREIGN KEY(job_id) REFERENCES jobs(job_id), 
FOREIGN KEY(freelancer_id) REFERENCES users(user_id) 
);

CREATE TABLE projects ( 
project_id BIGINT PRIMARY KEY AUTO_INCREMENT, 
user_id BIGINT, 
category_id BIGINT, 
project_title VARCHAR(255), 
description LONGTEXT, 
budget DECIMAL(12,2), 
duration VARCHAR(100), 
project_status ENUM('OPEN','IN_PROGRESS','COMPLETED'), 
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
FOREIGN KEY(user_id) REFERENCES users(user_id), 
FOREIGN KEY(category_id) REFERENCES categories(category_id) 
);

CREATE TABLE project_bids ( 
bid_id BIGINT PRIMARY KEY AUTO_INCREMENT, 
project_id BIGINT, 
freelancer_id BIGINT, 
proposal LONGTEXT, 
bid_amount DECIMAL(12,2), 
delivery_days INT, 
status ENUM('PENDING','ACCEPTED','REJECTED'), 
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
FOREIGN KEY(project_id) REFERENCES projects(project_id), 
FOREIGN KEY(freelancer_id) REFERENCES users(user_id) 
);

CREATE TABLE posts ( 
post_id BIGINT PRIMARY KEY AUTO_INCREMENT, 
user_id BIGINT, 
content LONGTEXT, 
image_url VARCHAR(255), 
status BOOLEAN DEFAULT TRUE, 
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
FOREIGN KEY(user_id) REFERENCES users(user_id) 
);

CREATE TABLE post_likes ( 
like_id BIGINT PRIMARY KEY AUTO_INCREMENT, 
post_id BIGINT, 
user_id BIGINT, 
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
FOREIGN KEY(post_id) REFERENCES posts(post_id),
FOREIGN KEY(user_id) REFERENCES users(user_id) 
);

CREATE TABLE post_comments ( 
comment_id BIGINT PRIMARY KEY AUTO_INCREMENT, 
post_id BIGINT, 
user_id BIGINT, 
comment_text LONGTEXT, 
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
FOREIGN KEY(post_id) REFERENCES posts(post_id), 
FOREIGN KEY(user_id) REFERENCES users(user_id) 
);

CREATE TABLE portfolios ( 
portfolio_id BIGINT PRIMARY KEY AUTO_INCREMENT, 
user_id BIGINT, 
title VARCHAR(255), 
description LONGTEXT, 
project_url VARCHAR(255), 
thumbnail VARCHAR(255), 
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
FOREIGN KEY(user_id) REFERENCES users(user_id) 
);

CREATE TABLE subscriptions ( 
subscription_id BIGINT PRIMARY KEY AUTO_INCREMENT, 
creator_id BIGINT, 
subscriber_id BIGINT,  
monthly_price DECIMAL(10,2), 
start_date DATE, 
end_date DATE, 
status ENUM('ACTIVE','EXPIRED'), 
FOREIGN KEY(creator_id) REFERENCES users(user_id), 
FOREIGN KEY(subscriber_id) REFERENCES users(user_id) 
);

CREATE TABLE messages ( 
message_id BIGINT PRIMARY KEY AUTO_INCREMENT, 
sender_id BIGINT, 
receiver_id BIGINT, 
message LONGTEXT, 
is_read BOOLEAN DEFAULT FALSE, 
sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

CREATE TABLE notifications ( 
notification_id BIGINT PRIMARY KEY AUTO_INCREMENT, 
user_id BIGINT, 
title VARCHAR(255), 
description TEXT, 
is_read BOOLEAN DEFAULT FALSE, 
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

CREATE TABLE reports ( 
report_id BIGINT PRIMARY KEY AUTO_INCREMENT, 
reported_by BIGINT, 
target_id BIGINT, 
report_type VARCHAR(100), 
reason TEXT, 
status ENUM('OPEN','RESOLVED'), 
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

CREATE TABLE cms_pages ( 
page_id BIGINT PRIMARY KEY AUTO_INCREMENT, 
title VARCHAR(255), 
slug VARCHAR(255), 
content LONGTEXT, 
status BOOLEAN DEFAULT TRUE 
);

CREATE TABLE site_settings ( 
setting_id BIGINT PRIMARY KEY AUTO_INCREMENT, 
site_name VARCHAR(255), 
logo VARCHAR(255), 
favicon VARCHAR(255), 
smtp_host VARCHAR(255), 
smtp_port VARCHAR(50), 
smtp_email VARCHAR(255), 
smtp_password VARCHAR(255) 
);

CREATE TABLE user_verifications ( 
verification_id BIGINT PRIMARY KEY AUTO_INCREMENT, 
user_id BIGINT, 
document_type VARCHAR(100), 
document_url VARCHAR(255), 
status ENUM('PENDING','APPROVED','REJECTED'), 
remarks TEXT, 
submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

show tables;

select *from users;


