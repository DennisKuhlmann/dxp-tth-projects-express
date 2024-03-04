<h3>This is a Node.js project with the Express.js framework. 
The rights are owned by the creator.</h3>


### How to use this project:

<li>Run npm install</li>
<li>Rename the .env_example file to .env </li>
<li>Check your database connection </li>
<li>Create a database</li>
<li>Create a table with name <b>tab_items</b></li>


```
CREATE TABLE `tab_items` (
  `dbf_int_index` int(11) NOT NULL AUTO_INCREMENT,
  `dbf_str_task` varchar(255) DEFAULT NULL,
  `dbf_datetime_created` datetime DEFAULT current_timestamp(),
  `dbf_int_status` int(11) DEFAULT 0 COMMENT '0 = in Progress; 1= done',
  PRIMARY KEY (`dbf_int_index`)
) ENGINE=MyISAM AUTO_INCREMENT=68 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
