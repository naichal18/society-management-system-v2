const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        let uri = process.env.MONGODB_URI;
        
        try {
            console.log('Attempting to connect to local MongoDB...');
            const conn = await mongoose.connect(uri);
            console.log(`MongoDB Connected: ${conn.connection.host}`);
        } catch (localErr) {
            console.log('Local MongoDB not found. Starting temporary In-Memory Database...');
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongoServer = await MongoMemoryServer.create();
            const memoryUri = mongoServer.getUri();
            const conn = await mongoose.connect(memoryUri);
            console.log(`In-Memory Database Connected: ${conn.connection.host}`);
            console.log('NOTE: Since you are using the in-memory database, data will reset when the server closes.');
            
            // Seed default admin user
            const User = require('../models/User');
            await User.create({
                name: 'System Admin',
                email: 'admin',
                phone: '1234567890',
                password: 'admin123',
                role: 'admin',
                flat: 'Admin',
                block: 'Office Wing',
                floor: 'Ground Floor',
                ownershipStatus: 'Owner',
                moveInDate: '10 Jan 2023'
            });
            console.log('Default admin seeded (Email: admin, Password: admin123)');

            // Seed default resident user
            await User.create({
                name: 'Test Resident',
                email: 'resident',
                phone: '9876543210',
                password: 'resident123',
                role: 'resident',
                flat: 'A-101',
                block: 'A Wing',
                floor: '1st Floor',
                ownershipStatus: 'Owner',
                moveInDate: '10 Jan 2023'
            });
            console.log('Default resident seeded (Email: resident, Password: resident123)');

            // Seed default gate keepers
            const GateKeeper = require('../models/GateKeeper');
            await GateKeeper.insertMany([
                { name: 'Ramesh Yadav',   shift: 'Day',    phone: '9876543210' },
                { name: 'Suresh Patel',   shift: 'Day',    phone: '9876543211' },
                { name: 'Mahesh Kumar',   shift: 'Night',  phone: '9876543212' },
                { name: 'Dinesh Singh',   shift: 'Night',  phone: '9876543213' },
                { name: 'Vijay Sharma',   shift: 'Relief', phone: '9876543214' },
            ]);
            console.log('Default gate keepers seeded (5 records)');

            // Seed default society rules
            const Rule = require('../models/Rule');
            await Rule.insertMany([
                { text: 'No loud music or noise after 10:00 PM in any flat or common area.' },
                { text: 'All visitors must register at the main gate before entry.' },
                { text: 'Vehicles must be parked only in the designated/assigned parking slots.' },
                { text: 'Keep all common areas, corridors, and lifts clean at all times.' },
                { text: 'Monthly maintenance bill must be paid before the 5th of every month.' },
                { text: 'Garbage must be disposed of only in the designated dustbins.' },
                { text: 'No stickers, nails, or modifications are allowed on common walls.' },
                { text: 'Pets must be kept on a leash in common areas at all times.' },
                { text: 'Balconies must not be used for drying clothes facing the main road.' },
                { text: 'Any renovation work in flats must be pre-approved by the society office.' },
            ]);
            console.log('Default society rules seeded (10 records)');

            // Seed default help contacts
            const HelpContact = require('../models/HelpContact');
            await HelpContact.insertMany([
                { role: 'Electrician', name: 'Ramesh Patel', phone: '9876543210', description: 'Electrical wiring, short circuits & power issues', category: 'Maintenance' },
                { role: 'Plumber', name: 'Suresh Kumar', phone: '9876541230', description: 'Pipe leakage, tap repair & drainage problems', category: 'Maintenance' },
                { role: 'Lift Repair', name: 'Arvind Lift Services', phone: '9876549870', description: 'Elevator breakdown, maintenance & inspection', category: 'Maintenance' },
                { role: 'Carpenter', name: 'Mahesh Yadav', phone: '9823456781', description: 'Door, furniture, window & woodwork repairs', category: 'Maintenance' },
                { role: 'Painter', name: 'Dinesh Sharma', phone: '9823456782', description: 'Interior & exterior painting services', category: 'Maintenance' },
                { role: 'AC Repair', name: 'CoolBreeze Services', phone: '9823456783', description: 'AC servicing, gas refill & repair', category: 'Maintenance' },
                { role: 'CCTV Technician', name: 'Vijay Security Tech', phone: '9823456784', description: 'CCTV installation, repair & monitoring setup', category: 'Security' },
                { role: 'Water Tank Cleaner', name: 'AquaClean Services', phone: '9823456785', description: 'Water tank cleaning & disinfection', category: 'Sanitation' },
                { role: 'Security Supervisor', name: 'Inspector Raj Singh', phone: '9823456786', description: 'Security concerns, gate management & incidents', category: 'Security' },
                { role: 'Garbage Collection', name: 'CleanCity Agency', phone: '9823456787', description: 'Daily garbage pickup & waste management', category: 'Sanitation' },
                { role: 'Internet / WiFi', name: 'NetFast Support', phone: '9823456788', description: 'Internet outage, router setup & speed issues', category: 'Utility' },
                { role: 'Pest Control', name: 'PestAway Solutions', phone: '9823456789', description: 'Cockroach, rat & pest extermination services', category: 'Sanitation' },
                { role: 'Fire Emergency', name: 'City Fire Brigade', phone: '101', description: '24x7 fire emergency response & rescue', category: 'Emergency' },
                { role: 'Ambulance', name: 'City Ambulance Service', phone: '108', description: '24x7 medical emergency & ambulance dispatch', category: 'Emergency' },
                { role: 'Society Office', name: 'Society Management', phone: '9823456790', description: 'Admin queries, NOC, documents & general help', category: 'Admin' },
                { role: 'Generator Technician', name: 'PowerGen Services', phone: '9823456791', description: 'DG set maintenance, fuel & power backup issues', category: 'Utility' }
            ]);
            console.log('Default help contacts seeded (16 contacts)');

            // Seed default residents
            const Resident = require('../models/Resident');
            await Resident.insertMany([
                { name: 'Rahul Verma', flat: 'A-101', phone: '9876543215', email: 'rahul@example.com', vehicles: 1 },
                { name: 'Priya Sharma', flat: 'B-202', phone: '9876543216', email: 'priya@example.com', vehicles: 2 },
                { name: 'Amit Patel', flat: 'A-102', phone: '9876543217', email: 'amit@example.com', vehicles: 1 },
                { name: 'Neha Singh', flat: 'C-301', phone: '9876543218', email: 'neha@example.com', vehicles: 0 },
                { name: 'Vikram Joshi', flat: 'B-201', phone: '9876543219', email: 'vikram@example.com', vehicles: 2 }
            ]);
            console.log('Default residents seeded (5 records)');

            // Seed default bills/payments matching the reference image
            const Payment = require('../models/Payment');
            await Payment.insertMany([
                {
                    billId: 'BILL-128',
                    payer: 'Rahul Verma',
                    unit: 'A-101',
                    amount: 2500,
                    billType: 'Maintenance',
                    chargesBreakdown: { maintenance: 2000, water: 200, electricity: 300, parking: 0, lift: 0, security: 0, other: 0 },
                    dueDate: '20 Jun 2026',
                    status: 'Paid',
                    paidDate: '19 Jun 2026',
                    notes: 'Regular maintenance fee',
                    period: 'Jun 2026'
                },
                {
                    billId: 'BILL-127',
                    payer: 'Priya Sharma',
                    unit: 'B-202',
                    amount: 800,
                    billType: 'Water Charges',
                    chargesBreakdown: { maintenance: 0, water: 800, electricity: 0, parking: 0, lift: 0, security: 0, other: 0 },
                    dueDate: '18 Jun 2026',
                    status: 'Unpaid',
                    notes: 'Water usage for May-Jun',
                    period: 'Jun 2026'
                },
                {
                    billId: 'BILL-126',
                    payer: 'Amit Patel',
                    unit: 'A-102',
                    amount: 1000,
                    billType: 'Parking Charges',
                    chargesBreakdown: { maintenance: 0, water: 0, electricity: 0, parking: 1000, lift: 0, security: 0, other: 0 },
                    dueDate: '18 Jun 2026',
                    status: 'Overdue',
                    notes: 'Covered parking space allocation charges',
                    period: 'Jun 2026'
                },
                {
                    billId: 'BILL-125',
                    payer: 'Neha Singh',
                    unit: 'C-301',
                    amount: 2500,
                    billType: 'Maintenance',
                    chargesBreakdown: { maintenance: 2200, water: 150, electricity: 150, parking: 0, lift: 0, security: 0, other: 0 },
                    dueDate: '15 Jun 2026',
                    status: 'Paid',
                    paidDate: '14 Jun 2026',
                    notes: 'Monthly maintenance',
                    period: 'Jun 2026'
                },
                {
                    billId: 'BILL-124',
                    payer: 'Vikram Joshi',
                    unit: 'B-201',
                    amount: 1500,
                    billType: 'Special Charges',
                    chargesBreakdown: { maintenance: 0, water: 0, electricity: 0, parking: 0, lift: 0, security: 0, other: 1500 },
                    dueDate: '25 Jun 2026',
                    status: 'Unpaid',
                    notes: 'Clubhouse event space booking fee',
                    period: 'Jun 2026'
                }
            ]);
            console.log('Default payments/bills seeded (5 records)');
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
