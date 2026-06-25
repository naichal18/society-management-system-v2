const mongoose = require('mongoose');

const connectDB = async () => {
    try {

        const uri = process.env.MONGODB_URI;

        if (!uri) {
            throw new Error("MONGODB_URI is not defined in environment variables.");
        }

        console.log("Connecting to MongoDB Atlas...");

        const conn = await mongoose.connect(uri);

        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // --- Helper for Dates ---
        const today = new Date();
        const formatDate = (offsetDays = 0) => {
            const d = new Date(today);
            d.setDate(d.getDate() + offsetDays);
            return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, ' ');
        };

        // --- Unconditional Admin & Resident Seeding ---
        const User = require('../models/User');
        const adminCount = await User.countDocuments({ role: 'admin' });
        if (adminCount === 0) {
            await User.create({
                name: 'System Admin', email: 'admin', phone: '1234567890', password: 'admin123',
                role: 'admin', flat: 'Admin', block: 'Office Wing', floor: 'Ground Floor',
                ownershipStatus: 'Owner', moveInDate: '10 Jan 2023'
            });
            console.log('Default admin seeded (Email: admin, Password: admin123)');
        }

        const residentCount = await User.countDocuments({ role: 'resident' });
        if (residentCount === 0) {
            await User.create({
                name: 'Test Resident', email: 'resident', phone: '9876543210', password: 'resident123',
                role: 'resident', flat: 'A-101', block: 'A Wing', floor: '1st Floor',
                ownershipStatus: 'Owner', moveInDate: '10 Jan 2023'
            });
            console.log('Default resident seeded (Email: resident, Password: resident123)');
        }

        // --- Unconditional Mock Data Seeding (Removed Host Restrictions) ---

        // 1. Gate Keepers
        const GateKeeper = require('../models/GateKeeper');
        if (await GateKeeper.countDocuments() === 0) {
            await GateKeeper.insertMany([
                { name: 'Rajesh Kumar', shift: 'Day', phone: '9876543210' },
                { name: 'Suresh Patel', shift: 'Night', phone: '9876543211' },
                { name: 'Mahesh Sharma', shift: 'Day', phone: '9876543212' },
                { name: 'Dinesh Singh', shift: 'Night', phone: '9876543213' },
                { name: 'Vijay Yadav', shift: 'Relief', phone: '9876543214' }
            ]);
            console.log('Default gate keepers seeded (5 records)');
        }

        // 2. Rules
        const Rule = require('../models/Rule');
        if (await Rule.countDocuments() === 0) {
            await Rule.insertMany([
                { text: 'No loud music after 10 PM.' },
                { text: 'Visitors must register at the gate.' },
                { text: 'Pets must be on a leash.' },
                { text: 'Parking only in allotted spaces.' },
                { text: 'No littering in common areas.' },
                { text: 'Children should not play in parking areas.' },
                { text: 'Maintenance charges must be paid before the due date.' },
                { text: 'Report any security issue immediately.' },
                { text: 'Use water responsibly.' },
                { text: 'Common facilities should be kept clean.' },
                { text: 'Speed limit inside the premises is 10 km/hr.' },
                { text: 'Swimming pool rules must be strictly followed.' },
                { text: 'Garbage must be segregated before disposal.' },
                { text: 'Gym access is restricted to residents only.' },
                { text: 'Do not leave personal items in corridors.' }
            ]);
            console.log('Default society rules seeded (15 records)');
        }

        // 3. Help Contacts
        const HelpContact = require('../models/HelpContact');
        if (await HelpContact.countDocuments() === 0) {
            await HelpContact.insertMany([
                { role: 'Society Office', name: 'Admin Desk', phone: '022-2345678', description: 'General administration queries' },
                { role: 'Security Desk', name: 'Main Gate', phone: '022-2345679', description: '24/7 Security reporting' },
                { role: 'Electrician', name: 'Ramesh Electricals', phone: '9876500001', description: 'Internal and external electrical issues' },
                { role: 'Plumber', name: 'Suresh Plumbing', phone: '9876500002', description: 'Water leaks and plumbing problems' },
                { role: 'Lift Maintenance', name: 'Otis Service', phone: '1800-123-456', description: 'Elevator breakdown services' },
                { role: 'Fire Department', name: 'City Fire Brigade', phone: '101', description: 'Emergency fire response' },
                { role: 'Ambulance', name: 'City Hospital', phone: '108', description: 'Medical emergencies' },
                { role: 'Police', name: 'Local Police Station', phone: '100', description: 'Law enforcement and security' },
                { role: 'Hospital', name: 'Apex Multi-specialty', phone: '022-9876543', description: 'Nearest emergency hospital' },
                { role: 'Gas Emergency', name: 'Mahanagar Gas', phone: '1906', description: 'Gas leak emergencies' },
                { role: 'Water Supply', name: 'BMC Water Board', phone: '1916', description: 'Municipal water supply complaints' },
                { role: 'Generator Technician', name: 'PowerGen Services', phone: '9876500003', description: 'DG set and power backup issues' }
            ]);
            console.log('Default help contacts seeded (12 contacts)');
        }

        // 4. Residents
        const Resident = require('../models/Resident');
        let residents = [];
        if (await Resident.countDocuments() === 0) {
            residents = await Resident.insertMany([
                { name: 'Rahul Sharma', flat: 'A-101', phone: '9876543201', email: 'rahul.s@example.com', vehicles: 1 },
                { name: 'Priya Patel', flat: 'B-203', phone: '9876543202', email: 'priya.p@example.com', vehicles: 2 },
                { name: 'Amit Verma', flat: 'C-305', phone: '9876543203', email: 'amit.v@example.com', vehicles: 1 },
                { name: 'Neha Shah', flat: 'D-102', phone: '9876543204', email: 'neha.s@example.com', vehicles: 0 },
                { name: 'Vikram Singh', flat: 'A-201', phone: '9876543205', email: 'vikram.s@example.com', vehicles: 2 },
                { name: 'Anjali Desai', flat: 'B-104', phone: '9876543206', email: 'anjali.d@example.com', vehicles: 1 },
                { name: 'Sanjay Gupta', flat: 'C-202', phone: '9876543207', email: 'sanjay.g@example.com', vehicles: 1 },
                { name: 'Pooja Reddy', flat: 'D-303', phone: '9876543208', email: 'pooja.r@example.com', vehicles: 1 },
                { name: 'Ravi Kumar', flat: 'A-304', phone: '9876543209', email: 'ravi.k@example.com', vehicles: 2 },
                { name: 'Sunita Joshi', flat: 'B-301', phone: '9876543210', email: 'sunita.j@example.com', vehicles: 0 },
                { name: 'Karan Malhotra', flat: 'C-101', phone: '9876543211', email: 'karan.m@example.com', vehicles: 1 },
                { name: 'Meera Iyer', flat: 'D-204', phone: '9876543212', email: 'meera.i@example.com', vehicles: 1 }
            ]);
            console.log('Default residents seeded (12 records)');
        } else {
            residents = await Resident.find();
        }

        // 5. Payments (Bills)
        const Payment = require('../models/Payment');
        if (await Payment.countDocuments() === 0 && residents.length > 0) {
            const statuses = [
                ...Array(10).fill('Paid'),
                ...Array(8).fill('Pending'),
                ...Array(4).fill('Overdue')
            ];

            let billIdCounter = 1000;
            const bills = [];

            residents.forEach((res, i) => {
                // Ensure at least one bill per resident
                const s1 = statuses[i % statuses.length];
                bills.push({
                    billId: `BILL-${billIdCounter++}`,
                    residentId: res._id, payer: res.name, unit: res.flat,
                    amount: 2500, billType: 'Maintenance',
                    dueDate: formatDate(5), status: s1, paidDate: s1 === 'Paid' ? formatDate(-5) : '',
                    period: 'Aug 2026'
                });

                // Add a second bill for some residents to hit the 22 total
                if (i < 10) {
                    const s2 = statuses[(i + residents.length) % statuses.length];
                    bills.push({
                        billId: `BILL-${billIdCounter++}`,
                        residentId: res._id, payer: res.name, unit: res.flat,
                        amount: 500, billType: 'Water Charges',
                        dueDate: formatDate(-2), status: s2, paidDate: s2 === 'Paid' ? formatDate(-10) : '',
                        period: 'Jul 2026'
                    });
                }
            });
            await Payment.insertMany(bills);
            console.log(`Default bills seeded (${bills.length} records)`);
        }

        // 6. Complaints
        const Complaint = require('../models/Complaint');
        if (await Complaint.countDocuments() === 0) {
            await Complaint.insertMany([
                { by: 'Rahul Sharma', unit: 'A-101', category: 'Maintenance', status: 'Open', details: 'Water leakage in the guest bathroom.', createdAt: formatDate(-1) },
                { by: 'Priya Patel', unit: 'B-203', category: 'Maintenance', status: 'In Progress', details: 'Lift not working in B wing.', createdAt: formatDate(-2) },
                { by: 'Amit Verma', unit: 'C-305', category: 'Security', status: 'Closed', details: 'Parking issue: unknown car in my slot.', createdAt: formatDate(-5) },
                { by: 'Neha Shah', unit: 'D-102', category: 'Noise', status: 'Open', details: 'Noise complaint from D-103 late night.', createdAt: formatDate(0) },
                { by: 'Vikram Singh', unit: 'A-201', category: 'Maintenance', status: 'In Progress', details: 'Street light issue near the garden.', createdAt: formatDate(-3) },
                { by: 'Anjali Desai', unit: 'B-104', category: 'Cleanliness', status: 'Closed', details: 'Garbage collection delay.', createdAt: formatDate(-7) },
                { by: 'Sanjay Gupta', unit: 'C-202', category: 'Security', status: 'Open', details: 'Security concern at the back gate.', createdAt: formatDate(-1) },
                { by: 'Pooja Reddy', unit: 'D-303', category: 'Maintenance', status: 'In Progress', details: 'Drain blockage in the kitchen sink.', createdAt: formatDate(-2) },
                { by: 'Ravi Kumar', unit: 'A-304', category: 'Maintenance', status: 'Closed', details: 'Seepage in the living room wall.', createdAt: formatDate(-10) },
                { by: 'Sunita Joshi', unit: 'B-301', category: 'Cleanliness', status: 'Open', details: 'Corridor not swept properly.', createdAt: formatDate(0) },
                { by: 'Karan Malhotra', unit: 'C-101', category: 'Maintenance', status: 'In Progress', details: 'Gym equipment damaged.', createdAt: formatDate(-4) },
                { by: 'Meera Iyer', unit: 'D-204', category: 'Other', status: 'Closed', details: 'Intercom not functioning.', createdAt: formatDate(-8) },
                { by: 'System Admin', unit: 'Office Wing', category: 'Maintenance', status: 'Open', details: 'Clubhouse AC requires servicing.', createdAt: formatDate(-1) },
                { by: 'System Admin', unit: 'Office Wing', category: 'Security', status: 'Closed', details: 'CCTV camera 4 offline.', createdAt: formatDate(-6) }
            ]);
            console.log('Default complaints seeded (14 records)');
        }

        // 7. Meetings
        const Meeting = require('../models/Meeting');
        if (await Meeting.countDocuments() === 0) {
            await Meeting.insertMany([
                { title: 'Society Monthly Meeting', date: formatDate(10), time: '10:00 AM', venue: 'Clubhouse', agenda: 'Review of monthly expenses.', status: 'Scheduled' },
                { title: 'Annual General Meeting', date: formatDate(-20), time: '11:00 AM', venue: 'Society Hall', agenda: 'Yearly budget and new committee election.', status: 'Completed', notes: 'Minutes circulated via email.' },
                { title: 'Maintenance Committee Meeting', date: formatDate(2), time: '05:00 PM', venue: 'Society Office', agenda: 'Lift repair contract renewal.', status: 'Scheduled' },
                { title: 'Festival Planning Meeting', date: formatDate(-5), time: '06:00 PM', venue: 'Clubhouse', agenda: 'Diwali celebration planning.', status: 'Completed', notes: 'Budget approved.' },
                { title: 'Security Review Meeting', date: formatDate(15), time: '04:00 PM', venue: 'Society Office', agenda: 'Reviewing current security agency performance.', status: 'Scheduled' },
                { title: 'Budget Meeting', date: formatDate(-10), time: '09:00 AM', venue: 'Society Hall', agenda: 'Finalizing the budget for the upcoming quarter.', status: 'Cancelled' }
            ]);
            console.log('Default meetings seeded (6 records)');
        }

        // 8. Visitors
        const Visitor = require('../models/Visitor');
        if (await Visitor.countDocuments() === 0) {
            await Visitor.insertMany([
                { name: 'Amazon Delivery', unit: 'A-101', type: 'Delivery', timeIn: '10:30 AM', timeOut: '10:45 AM' },
                { name: 'Flipkart Delivery', unit: 'B-203', type: 'Delivery', timeIn: '11:15 AM', timeOut: '11:25 AM' },
                { name: 'Zomato Delivery', unit: 'C-305', type: 'Delivery', timeIn: '01:00 PM', timeOut: '01:10 PM' },
                { name: 'Swiggy Delivery', unit: 'D-102', type: 'Delivery', timeIn: '08:30 PM', timeOut: '08:40 PM' },
                { name: 'Guest Visit (Ramesh)', unit: 'A-201', type: 'Guest', timeIn: '05:00 PM', timeOut: '' },
                { name: 'Electrician (Raju)', unit: 'B-104', type: 'Service', timeIn: '02:00 PM', timeOut: '03:30 PM' },
                { name: 'Plumber (Rakesh)', unit: 'C-202', type: 'Service', timeIn: '11:00 AM', timeOut: '12:00 PM' },
                { name: 'Maid (Sunita)', unit: 'D-303', type: 'Service', timeIn: '08:00 AM', timeOut: '10:00 AM' },
                { name: 'Carpenter (Abdul)', unit: 'A-304', type: 'Service', timeIn: '03:00 PM', timeOut: '' }
            ]);
            console.log('Default visitors seeded (9 records)');
        }

        // 9. Notifications (Assuming you have a Notice or Notification model)
        const Notice = require('../models/Notice');
        if (Notice && await Notice.countDocuments() === 0) {
            await Notice.insertMany([
                { title: 'Water supply maintenance tomorrow.', body: 'Please store water. Supply will be cut from 10 AM to 2 PM.', createdAt: formatDate(0) },
                { title: 'Lift maintenance scheduled.', body: 'A-Wing lift will be under maintenance on Friday.', createdAt: formatDate(-1) },
                { title: 'Monthly meeting reminder.', body: 'Do not forget to attend the society monthly meeting this Sunday.', createdAt: formatDate(-2) },
                { title: 'Maintenance bill generated.', body: 'Your maintenance bills for the current month have been generated. Please pay before the due date.', createdAt: formatDate(-3) },
                { title: 'Festival celebration notice.', body: 'Join us for the upcoming festival celebrations in the clubhouse.', createdAt: formatDate(-4) },
                { title: 'Parking inspection.', body: 'Random parking inspections will be carried out this week.', createdAt: formatDate(-5) },
                { title: 'Rainwater harvesting awareness.', body: 'A short seminar on rainwater harvesting will be held in the society hall.', createdAt: formatDate(-6) },
                { title: 'Security alert.', body: 'Please ensure your doors are locked and report any suspicious activity.', createdAt: formatDate(-7) },
                { title: 'Pest control drive.', body: 'Pest control will be done in common areas tomorrow.', createdAt: formatDate(-8) },
                { title: 'Gym equipment updated.', body: 'New treadmills have been installed in the gym.', createdAt: formatDate(-9) }
            ]);
            console.log('Default notices seeded (10 records)');
        }

    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
