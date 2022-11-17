
create table citizen(
Full_name varchar(255),
User_Id int,
Password_  varchar(255),
Phone_no bigint,
Address varchar(255),
Email_Id varchar(255),
aadhar_card_number bigint,
primary key(User_Id)
);
insert into citizen values("Krishnakanth",20029,"Kk@1989",9878586848,"8/4, Sagar Complex, Siddhi Sagar Industrial E, Chinchpada, Gokhiware, Ambamolya",
"krishnakanthk66@gmail.com",800895690290),
("Rama",21005,"Ram234",96857415,"365, B, Tulsi Nagar OPP. Apollo DB City, Nepaniya Near Mahalaxmi Nagar,Baroda Kara","rama.23@gmail.com",123456789456125),
("Jyoshna",22058,"Jo1234",8754968512,"11, B, Vaibhav Nagar,Infront of Sharma Sweet,Kalaria ","Jyoshna45@gmail.com",1147258736981479),
("Sruthika",21089,"sruth987",7958461245,"402-D, Arora Nagar,B-camp Post,Bhicholi Mardhana","Sruthi.ka@gmail.com",2258114522365589);

create table Water_Bill(
User_ID int,
Water_Bill_no int,
Amount int,
Payment_status varchar(255),
primary key(Water_Bill_no),
foreign key(User_ID) references citizen(User_Id));

insert into Water_Bill values(20029,210001014,1270,"unpaid"),
(21005,21001452,2500,"paid"),
(22058,25142510,1750,"paid"),
(21089,21548736,1930,"unpaid");


create table Electricity_Bill(
User_ID varchar(255),
Electricity_Bill_no int,
Amount int,
Payment_status varchar(255),
primary key(Electricity_Bill_no),
foreign key(User_ID) references citizen(User_Id));

insert into Electricity_Bill values(20029,25698574,2700,"unpaid"),
(21005,25475896,750,"unpaid"),
(22058,22556644,1850,"unpaid"),
(21089,21548798,3930,"paid");


create table Property_Tax(
User_ID varchar(255),
Property_Bill_No int,
Type_of_property varchar(255),
Prop_Owner varchar(255),
Registration_date date,
Amount int,
Payment_status varchar(255),
primary key(Property_Bill_No),
foreign key(User_ID) references citizen(User_Id));

insert into Property_Tax values(20029,12457836,"Residential property","Rama","2022-06-12",25000,"unpaid"),
(21005,65871452,75000,"Industrial Property","Krishnakanth","2021-01-25","unpaid"),
(22058,12598933,18000,"Land Property","Sruthika","2014-02-06","unpaid"),
(21089,2587433,39000,"Residential Property","Jyoshna","2019-05-18","paid");


create table waste_details(
S_No int ,
Area varchar(255),
Quantity int);

insert into waste_details values(1,"Ambamolya",31),
(2,"Aranya",40),
(3,"Asrawad khrud",41),
(4,"Balya Kheda",36),
(5,"Begam Kheda",40),
(6,"Bhicholi Mardhana",58),
(7,"Bilawali",35),
(8,"Daturia",45),
(9,"Dudhia",28),
(10,"Bawarqua",32),
(11,"Kalaria",48),
(12,"Morod",25),
(13,"Simrol",30);
 
 
 create table waste_junkstore_details(
Waste_ID int,
Junkstore_name varchar(255),
Collected_date date,
Dry_quantity int,
Dry_Price int,
Wet_quantity int,
Paid_Amount int,
primary key(Waste_ID));

insert into waste_junkstore_details values(01,"Ajay","2021-12-01",31,40000,20,25000),
(02,"Janaki","2022-10-12",53,60000,35,48000),
(03,"kanak","2021-09-09",25,35000,24,18000),
(04,"Laxman","2022-05-15",98,120000,35,80000),
(05,"Kamala","2022-07-07",28,37500,15,15750);


create table organisation(
Waste_ID int,
Junkstore_name varchar(255),
Address varchar(255),
Type_of_waste varchar(255),
Product_produced varchar(255),
primary key(Junkstore_name),
foreign key (Waste_ID) references waste_junkstore_details(Waste_ID));

insert into organisation values(01,"Ajay","Veer Bazar Road,New Delhi","Dry","door-mats"),
(02,"Janaki","Khushboo mehal road,Kolkata","Dry and wet","Dog-collars"),
(03,"kanak","Khandwa Road,Indore","Dry and wet","Yoga-mats"),
(04,"Laxman","Arora Nagar, Kurnool","Dry","Sleeping bags"),
(05,"Kamala","Sugandh park road,Bhopal","Dry","Dustbins,trash bags");




