import express from "express";
import cors from "cors";
import mongoose, { model } from "mongoose";
import nodemailer from "nodemailer";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from 'crypto';

// Load environment variables from .env file
dotenv.config();

// Access the SECRET_KEY variable
const keySecret = process.env.SECRET_KEY;

// If SECRET_KEY is not defined in the environment, generate a random secret key
const secretKey = keySecret || crypto.randomBytes(32).toString('hex');


// email config
 
const transporter = nodemailer.createTransport({
  service:"gmail",
  port: 465,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "arnobchak@gmail.com",
    pass: "sxhj dkep rmic scwm",
  },
});







const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());



// Database
mongoose.connect('mongodb://127.0.0.1:27017/ShiftScheduleDB')
.then(() => console.log("My database is connected"))
  

/*----------------------------------------------------------------------------
------------------------------------- Model-----------------------------------
------------------------------------------------------------------------------*/


// =======================================================================================

// Database  user Model
const userSchema = new mongoose.Schema({
    
    name: String,   
    email: String,
    password: String,
    status: String,
    role: String,
    verifyToken:String,

})

const User = mongoose.model("User", userSchema)

// =========================================================================================

// Database  Manager Profile Model
const managerProfileSchema = new mongoose.Schema({

    mgrName:String,
    mgrEmail:String,
    mgrMobile: Number,
    mgrDob: String,
    mgrDoj: String
})

const ManagerProfile = mongoose.model("ManagerProfile", managerProfileSchema)


// ==========================================================================================



// Database  employee Model
const employeeSchema = new mongoose.Schema({
    empCode: Number,
    empName: {type:mongoose.Schema.Types.Mixed, ref: 'User'},   
    empEmail: { type:mongoose.Schema.Types.Mixed, ref: 'User' },
    empMobile: Number,
    empDob: String,
    empDoj: String
    

})


const Employee = mongoose.model("Employee", employeeSchema)


// =================================================================================================


// Database  shift Model
const shiftSchema = new mongoose.Schema({
    shiftName: String,
    startTime: String,  
    endTime : String,
    status:String
    
}) 

const Shift = mongoose.model("Shift", shiftSchema)

// ======================================================================================================


// Database  shiftSchedule Model

const shiftScheduleSchema = new mongoose.Schema({

    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    
    fromDate:String,
    toDate: String,
    sun: {type:mongoose.Schema.Types.Mixed, ref: 'Shift'},
    mon: {type:mongoose.Schema.Types.Mixed, ref: 'Shift'},
    tue: {type:mongoose.Schema.Types.Mixed, ref: 'Shift'},
    wed: {type:mongoose.Schema.Types.Mixed, ref: 'Shift'},
    thu: {type:mongoose.Schema.Types.Mixed, ref: 'Shift'},
    fri: {type:mongoose.Schema.Types.Mixed, ref: 'Shift'},
    sat: {type:mongoose.Schema.Types.Mixed, ref: 'Shift'},


    
})

const ShiftSchedule = mongoose.model("ShiftSchedule", shiftScheduleSchema)

// =========================================================================================

// Database  shift Swap Model
const shiftSwapSchema = new mongoose.Schema({

    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    originalDate:String,
    originalShift: {type:mongoose.Schema.Types.ObjectId, ref: 'Shift'},
    requestedDate:String,
    requestedShift: {type:mongoose.Schema.Types.ObjectId, ref: 'Shift'},
    reason: String,
    submissionDate: String,
    requestorEmail:{type:mongoose.Schema.Types.ObjectId, ref: 'User'},
    counterPartEmail:{type:mongoose.Schema.Types.ObjectId, ref: 'User'},
    notes: String,
    status: String

})

const ShiftSwap = mongoose.model("ShiftSwap", shiftSwapSchema)

// ============================================================================================

// Model for employee leave application

const leaveApplicationSchema = new mongoose.Schema({
  employeeId:{type:mongoose.Schema.ObjectId, ref:'User'},
  department: String,
  leaveType: {type:mongoose.Schema.ObjectId, ref:'LeaveType'} ,
  totalDays:Number,
  leaveBalance:Number,
  startDate : String,
  endDate:String,
  dateOfApplication:String,
  reason :String,
  remarks:String,
  status:String,
  applicantName:String,
  
}) 

const LeaveApplication = mongoose.model("LeaveApplication", leaveApplicationSchema)

// =======================================================================================================

// Database  shift Model
const leaveTypeSchema = new mongoose.Schema({
  leaveName: String,
  description: String,  
  totalDays: String,
  status:String
  
}) 

const LeaveType = mongoose.model("LeaveType", leaveTypeSchema)

// ==========================================================================================================

  

/*----------------------------------------------------------------------------
------------------------------------- Router-----------------------------------
------------------------------------------------------------------------------*/


// ================================================================================
// Router  Admin Register
// =================================================================================
app.post("/AdminRegister", async (req, res) => {
    const {name, email, password, status, role } = req.body;
    try {
        const existingAdmin = await User.findOne({role: "Admin", status:'Active' });
        if (existingAdmin) {
            return res.status(400).json({ message: "You are not authorized to register" });
        }
        
        const newAdmin = new User({ name, email, password, status,role });
        await newAdmin.save();
        res.status(201).json({ message: "Admin account created successfully. Please Login now." });
    } catch (error) {
        console.error("Error in registration:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});        

// ======================================================================
// Router for  Admin Login
// =======================================================================
app.post("/Login", async (req, res) => { 
    const { email, password } = req.body;

    try{

        const admin= await User.findOne({ email});
        if (admin){

            if (password === admin.password && admin.role === "Admin")
             {res.status(200).json({ message: "Login successful",name:admin.name })
            }
            else
            {res.status(400).json({ message: "Invalid password or role" })}

        } 
        else{res.status(400).json({ message: "Admin not found. Please register" })}
    

    }
    catch(error){

        res.status(500).json({ message: "Internal server error" });
    }


       
});


// ====================================================================================  
//  Router for fetching admin account details
// ====================================================================================
app.get('/admins', async (req, res) => {
    try {
        const admins = await User.find({role:'Admin'});
        res.json(admins);
    } catch (error) {
        console.error('Error fetching accounts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ====================================================================================
//  Router for deleting admin
// ====================================================================================

app.delete('/Delete/:id', async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Admin account deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});


// =======================================================================================
// Router for fetching manager account details
// =======================================================================================
    app.get('/ManagerAccount', async (req, res) => {
    try {
        const account = await User.find({role:'Manager'});
        res.json(account);
    } catch (error) {
        console.error('Error fetching accounts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
    });

// ==========================================================================================
// Router for fetching employee account details
// ==========================================================================================
app.get('/EmployeeAccount', async (req, res) => {
    try {
        const account = await User.find({role:'Employee'});
        res.json(account);
    } catch (error) {
        console.error('Error fetching accounts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
    });

// ================================================================================
// Router for fetching total employees on roll
// ================================================================================
app.get('/EmployeeAccountOnRoll', async (req, res) => {
    try {
        const account = await User.find({role:'Employee', status:"Active"});
        res.json(account);
    } catch (error) {
        console.error('Error fetching accounts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
    });

// ==========================================================================================
// Router for fetching total employees on roll
// ==========================================================================================
app.get('/ManagerAccountOnRoll', async (req, res) => {
    try {
        const account = await User.find({role:'Manager', status:"Active"});
        res.json(account);
    } catch (error) {
        console.error('Error fetching accounts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
    });

// ================================================================================
// Get account by ID
// ================================================================================
    app.get('/GetAccountById/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (user == null) {
        return res.status(404).json({ message: 'Account not found' });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

// ==============================================================================
// Get shift swap data by ID
// ==============================================================================
app.get('/GetAllShiftSwapById/:id', async (req, res) => {
    try {
      const data = await ShiftSwap.findById(req.params.id);
      if (data == null) {
        return res.status(404).json({ message: 'Data not found' });
      }
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

// =================================================================================
// Router for adding shift details
// =================================================================================
app.post("/AddShift", async (req, res) => {
    const { shiftName, startTime, endTime , status} = req.body;
    try {
        const existingShift = await Shift.findOne({shiftName, startTime,endTime});
        if (existingShift) {
            
            return res.status(400).json({ message: "Shift details already exists" });
        }

        const newShift = new Shift({ shiftName, startTime, endTime , status});
        await newShift.save();
        res.status(201).json({ message: "Shift record added successfully." });
    } catch (error) {
        console.error("Error in data entry:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// =======================================================================
// Router for getting all shift data
// =======================================================================
app.get("/GetAllShiftData", async (req, res) => {
    try {
        const shift = await Shift.find();
        res.status(200).json(shift);
    } catch (error) {
        console.error("Error in data retrieval:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// =============================================================================
// Router for getting total shifts
// =============================================================================
app.get("/GetTotalShift", async (req, res) => {
    try {
        const shift = await Shift.find({status:"Active"});
        res.status(200).json(shift);
    } catch (error) {
        console.error("Error in data retrieval:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// =========================================================================
// Router for getting total employee on leave in the current date
// =========================================================================
app.get('/approved-leaves-today', async (req, res) => {
  try {
    const currentDate = new Date().toISOString().split('T')[0];
    console.log(`Current Date: ${currentDate}`);

    const query = {
      status: 'Approved',
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate }
    };
    console.log('Query:', query);

    const totalApprovedLeaves = await LeaveApplication.countDocuments(query);

    console.log(`Total Approved Leaves: ${totalApprovedLeaves}`);
    res.status(200).json({ totalApprovedLeaves });
  } catch (error) {
    console.error('Error fetching approved leaves:', error);
    res.status(500).json({ error: 'An error occurred while fetching the data' });
  }
});

// ===================================================================================
// Get shift details by Id
// ===================================================================================
  app.get('/GetShiftById/:id', async (req, res) => {
    try {
      const shift = await Shift.findById(req.params.id);
      if (shift == null) {
        return res.status(404).json({ message: 'Shift details not found' });
      }
      res.json(shift);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

// ============================================================================ 
// Update account by ID
// ============================================================================

app.put('/UpdateAccount/:id', async (req, res) => {
    try {
      const { email, status } = req.body;
      
      const existingEmployee = await User.findOne({ email });
      if (existingEmployee && existingEmployee._id.toString() !== req.params.id) {
        return res.status(400).json({ message: 'Employee with the same email already exists' });
      }

// Update the user's email and status using findByIdAndUpdate
      await User.findByIdAndUpdate(req.params.id, { email, status });
      await Employee.findByIdAndUpdate(req.params.id, { email, status });
  
      res.json({ message: 'Employee updated successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
// ==========================================================================
// Update shift status by Id
// ==========================================================================

app.put('/UpdateShiftStatus/:id', async (req, res) => {
    try {
      const { shiftName, startTime, endTime, status } = req.body;
      
      const existingShift= await Shift.findOne({shiftName, startTime, endTime, status:"Active"})
      if (existingShift && existingShift._id.toString() !== req.params.id) {
        return res.status(400).json({ message: 'Shift details already exists' });
      }

// Update the shift status using findByIdAndUpdate
      await Shift.findByIdAndUpdate(req.params.id, {status });
    
  
      res.json({ message: 'Status updated successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

//============================================================================
// Router  for Manager Registration
// ===========================================================================
app.post("/ManagerRegister", async (req, res) => {
    const {name, email, password,status, role} = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Employee with the same email already exists" });
        }
        const newUser = new User({name, email, password ,status, role });
        await newUser.save();
        res.status(201).json({ message: "Manager account created successfully." });
    } catch (error) {
        console.error("Error in registration:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});    

// ====================================================================================
// Router for  Manager Login
// ====================================================================================
app.post("/ManagerLogin", async (req, res) => { 
    const { email, password } = req.body;

    try{

        const user = await User.findOne({ email });
        if (user){

            if (password === user.password && user.role === "Manager" && user.status === "Active")
             {res.status(200).json({ message: "Login successful",name:user.name })
            }
            else
            {res.status(400).json({ message: "Invalid password or role or resigned" })}

        } 
        else{res.status(400).json({ message: "Manager not found." })}
    

    }
    catch(error){

        res.status(500).json({ message: "Internal server error" });
    }



       
});


// =================================================================================
// Router for fetching employee account details
// =================================================================================
app.get('/EmployeeAccount', async (req, res) => {
    try {
        const accounts = await User.find({role: "Employee", status:"Active"}).select('name email');
        if (!accounts || accounts.length===0) {
            return res.status(404).json({ message: ' No active employee found' });
        }
        res.status (200).json(accounts);
    } catch (error) {
        console.error('Error fetching accounts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
    });

//=======================================================================================
// Router for adding manager profile
// ======================================================================================

app.post("/AddManagerProfile", async (req, res) => {
    const {mgrName, mgrEmail, mgrMobile, mgrDob, mgrDoj } = req.body;
    try {
        const existingManager=await ManagerProfile.findOne({mgrName},{mgrEmail});
        if (existingManager){
          return res.status(400).json({message:'Manager profile already exists.'});

        };

        const existingManagerMobile=await ManagerProfile.findOne({mgrMobile});
        if (existingManagerMobile){
          return res.status(400).json({message:'This mobile number already registered. Please try another one.'});

        }

        const newManagerProfile = new ManagerProfile({mgrName, mgrEmail, mgrMobile, mgrDob, mgrDoj });
        await newManagerProfile.save();
        res.status(201).json({ message: "Manager profile added successfully." });
    } catch (error) {
        console.error("Error in registration:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ==============================================================================
// Router for getting all manager profile data
// ==============================================================================
app.get("/GetManagerProfileData", async (req, res) => {
    try {
        const managerProfile = await ManagerProfile .find();
         res.status(200).json(managerProfile );
        
    } catch (error) {
        console.error("Error in data retrieval:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// =========================================================================
// Router for getting all employee profile data
// =========================================================================
app.get("/GetEmployeeData", async (req, res) => {
    try {
        const employeeProfile = await Employee .find()
        .populate({ path: 'empName',model: 'User', select: 'name' })
        .populate({path:'empEmail',model:'User', select:'email'})
         res.status(200).json(employeeProfile );
        
    } catch (error) {
        console.error("Error in data retrieval:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ======================================================================
// Router for getting manager by Id
// ======================================================================
app.get('/GetManagerProfileById/:id', async (req, res) => {
    try {
      const manager = await ManagerProfile.findById(req.params.id);
      if (manager == null) {
        return res.status(404).json({ message: 'Manager not found' });
      }
      res.json(manager);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

// ==============================================================================
// Router for getting employee by ID
// ==============================================================================
    app.get('/GetEmployeeById/:id', async (req, res) => { 
    try {
      const employee = await Employee.findById(req.params.id);
      if (employee == null) {
        return res.status(404).json({ message: 'employee not found' });
      }
      res.json(employee);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

// =======================================================================
// Update manager profile by Id
// =======================================================================
app.put('/UpdateManagerProfile/:id', async (req, res) => {
    try {
      const {mgrMobile } = req.body;
      
      const existingEmployee = await ManagerProfile.findOne({ mgrMobile });
      if (existingEmployee && existingEmployee._id.toString() !== req.params.id) {
        return res.status(400).json({ message: 'Manager with the same mobile number already exists' });
      }
      
      await ManagerProfile.findByIdAndUpdate(req.params.id, {mgrMobile });
      res.json({ message: 'Mobile number updated successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});

// ========================================================================
// Update employee profile by Id
// ========================================================================
app.put('/UpdateEmployee/:id', async (req, res) => {
    try {
      const {empMobile } = req.body;
      
      const existingEmployee = await Employee.findOne({empMobile} );
      if (existingEmployee && existingEmployee._id.toString() !== req.params.id) {
        return res.status(400).json({ message: 'Employee with the same mobile number already exists' });
      }
      
      await Employee.findByIdAndUpdate(req.params.id, {empMobile });
      res.json({ message: 'Mobile number updated successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});

// ============================================================================
// Update  shift swap status by Id
// ============================================================================
app.put('/UpdateShiftSwapStatus/:id', async (req, res) => {
    try {
        const {status } = req.body;
        await ShiftSwap.findByIdAndUpdate(req.params.id, {status });
      res.json({ message: 'Status updated successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});

// ==========================================================================
//   Delete manager profile by Id
// ==========================================================================

app.delete('/DeleteManagerProfile/:id', async (req, res) => {
    try {
      await ManagerProfile.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Manager profile deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
})


// =============================================================================
// Router for Employee Registration
// =============================================================================
app.post("/EmployeeRegister", async (req, res) => {
    const {name, email, password,status, role } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Employee with the same email already exists" });
        }
        const newUser = new User({name, email, password ,status, role});
        await newUser.save();
        res.status(201).json({ message: "Employee account created successfully." });
    } catch (error) {
        console.error("Error in registration:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});    

    
// ============================================================================
// Router for  Employee Login
// ============================================================================
app.post("/EmployeeLogin", async (req, res) => { 
    const { email, password } = req.body;

    try{

        const user = await User.findOne({ email });
        if (user){

            if (password === user.password && user.role === "Employee" && user.status==="Active")
             {res.status(200).json({ message: "Login successful",name:user.name })
            }
            else
            {res.status(400).json({ message: "Invalid password or role or resigned" })}

        } 
        else{res.status(400).json({ message: "Employee not found." })}
    

    }
    catch(error){

        res.status(500).json({ message: "Internal server error" });
    }



       
});


// ==========================================================================================
// Router for adding new employee
// ==========================================================================================
app.post("/AddEmployee", async (req, res) => {
  const { empCode, empName, empEmail, empMobile, empDob, empDoj } = req.body;
  try {
      // Check if an employee already exists with the provided empCode
      const existingEmpCode = await Employee.findOne({ empCode });
      if (existingEmpCode) {
          return res.status(400).json({ message: 'Employee code already exists!' });
      }

      // Check if an employee already exists with the provided empEmail
      const existingEmpEmail = await Employee.findOne({ empEmail });
      if (existingEmpEmail) {
          return res.status(400).json({ message: 'Employee email already exists!' });
      }

      // Check if an employee already exists with the provided empMobile
      const existingEmpMobile = await Employee.findOne({ empMobile });
      if (existingEmpMobile) {
          return res.status(400).json({ message: 'Employee mobile number already exists!' });
      }

      const newEmployee = new Employee({ empCode, empName, empEmail, empMobile, empDob, empDoj });
      await newEmployee.save();
      res.status(201).json({ message: "Employee's record saved successfully." });
  } catch (error) {
      console.error("Error in data entry:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

// =============================================================================
// Router for getting all employees data
// =============================================================================
app.get("/GetAllEmployees", async (req, res) => {
    try {
        const employees = await Employee.find()
        .populate({ path: 'empName',model: 'User', select: 'name' })
        .populate({ path: 'empEmail',model: 'User', select: 'email' });
        res.status(200).json(employees);
    } catch (error) {
        console.error("Error in data retrieval:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

// =============================================================================
// Router for getting all shift swap data
// =============================================================================
app.get("/GetAllShiftSwapData", async (req, res) => {
    try {
        const data = await ShiftSwap.find()
        .populate({ path: 'employeeId',model: 'User', select: 'name email' })
        .populate({ path: 'originalShift',model: 'Shift', select: 'shiftName startTime endTime' })
        .populate({path: 'requestedShift',model: 'Shift', select: 'shiftName startTime endTime'})
        .populate({path: 'counterPartEmail',model: 'User', select: 'name email'});
        res.status(200).json(data);
    } catch (error) {
        console.error("Error in data retrieval:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

// =========================================================================
//   Delete employee by ID
// =========================================================================
app.delete('/DeleteEmployee/:id', async (req, res) => {
    try {
      await Employee.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
})

// ====================================================================================
// Router for adding shift Schedule
// ====================================================================================
app.post("/AddShiftSchedule", async (req, res) => {
    const { employeeId, fromDate, toDate, sun, mon, tue, wed, thu, fri, sat  } = req.body;
    try {
        const existingShiftSchedule = await ShiftSchedule.findOne({ employeeId, fromDate, toDate});
        if (existingShiftSchedule) {
            
            return res.status(400).json({ message: "Shift schedule of that employee for that period already exists" });
        }

        const newShiftSchedule = new ShiftSchedule({ employeeId, fromDate, toDate, sun, mon, tue, wed, thu, fri, sat });
        await newShiftSchedule.save();
        res.status(201).json({ message: "Shift schedule saved successfully." });
        
    } catch (error) {
        console.error("Error in data entry:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// =============================================================================
//   Delete shift schedule details by Id
// =============================================================================

app.delete('/DeleteShiftSchedule/:id', async (req, res) => {
    try {
        const shiftId = req.params.id;
        // Update ShiftSchedule documents that reference the deleted shift
        await ShiftSchedule.updateMany(
            { $or: [{ sun: shiftId }, { mon: shiftId }, { tue: shiftId }, { wed: shiftId }, { thu: shiftId }, { fri: shiftId }, { sat: shiftId }] },
            { $unset: { sun: shiftId, mon: shiftId, tue: shiftId, wed: shiftId, thu: shiftId, fri: shiftId, sat: shiftId } }
        );
        // Delete the shift itself
        await ShiftSchedule.findByIdAndDelete(shiftId);
        res.status(200).json({ message: 'Ok' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ===============================================================================
// Router for getting all shift schedule data
// ===============================================================================
app.get("/GetAllShiftScheduleData", async (req, res) => {
    try {
        const shiftSchedule = await ShiftSchedule.find()
        .populate ({path:'employeeId', model: 'User', select: 'name'});

        // Iterate over each shift schedule document
        for (let schedule of shiftSchedule) {
            // Iterate over each day field
            for (let day of ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']) {
                // Check if the value is 'off'
                if (schedule[day] === 'Off') {
                    // If it's 'off', set it directly without populating
                    continue;
                }
                // Check if the value is an ObjectId
                if (mongoose.Types.ObjectId.isValid(schedule[day])) {
                    // If it's an ObjectId, populate it
                    schedule[day] = await Shift.findById(schedule[day]).select('shiftName startTime endTime');
                }
                else {
                    schedule[day] = "Off";
                }
                // Otherwise, it's a string, no need to populate
            }
        }

        res.status(200).json(shiftSchedule);
    } catch (error) {
        console.error("Error in data retrieval:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// =================================================================================
// Router for adding shift Swap details
// =================================================================================
app.post("/AddShiftSwap", async (req, res) => {
    const { employeeId, originalDate,originalShift, requestedDate, requestedShift, 
      reason, submissionDate, requestorEmail, counterPartEmail, notes, status } = req.body;

    try {
        const existingData= await ShiftSwap.findOne({employeeId});
        if (existingData) {
            
            return res.status(400).json({ message: "You have already made a shift change request." });
        }

        const newData = new ShiftSwap({ employeeId, originalDate,originalShift, requestedDate, requestedShift, reason, submissionDate, requestorEmail, counterPartEmail,notes, status });
        await newData.save();
        res.status(201).json({ message: "Request sent successfully." });
        
    } catch (error) {
        console.error("Error in data entry:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ==========================================================================
//   Delete shift swap request by Id
// ==========================================================================

app.delete('/DeleteShiftSwap/:id', async (req, res) => {
    try {
      await ShiftSwap.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Record deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
})

// ========================================================================
// Router for sending email link to User
// ========================================================================
app.post("/sendPasswordLink", async (req, res) => {
  

  const { email } = req.body;
  if (!email) {
      return res.status(400).json({ message: 'Enter your email' });
  }

  try {
      const userFind = await User.findOne({ email });
  
      if (!userFind) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Token generate for reset password
      const token = jwt.sign({ _id: userFind._id }, secretKey, { expiresIn: "300s" }); //Expiry time to be set as per requirement.

      const setAdminToken = await User.findByIdAndUpdate({_id: userFind._id}, {verifyToken: token}, {new: true});
      
      if (setAdminToken) {
          const mailOptions = {
              from: "arnobchak@gmail.com",
              to: email,
              subject: "Password Reset Link",
              text: `This link is valid for 5 minutes http://localhost:3000/forgotpassword/${userFind.id}/${setAdminToken.verifyToken}`
          }

          transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                  console.log("Error", error);
                  res.status(401).json({message: "Email not sent"});
              } else {
                  console.log("Email sent", info.response);
                  res.status(201).json({message: "Email sent successfully"})
              }
          })
      }
  } catch (error) {
      res.status(401).json({message: "Invalid User"});
  }
});

// ===============================================================
// Router for verify User for password reset
// ===============================================================

app.get("/forgot-password/:id/:token", async (req, res) => {
    const { id, token } = req.params;

  
    try {
      const [validAdmin, verifytoken] = await Promise.all([
        User.findOne({ _id: id, verifyToken: token }),
        jwt.verify(token, secretKey)
      ]);
  
  
      if (validAdmin && verifytoken._id) {
        res.status(201).json({ status: 201, validAdmin });
      } else {
        res.status(401).json({ status: 401, message: "User does not exist." });
      }
    } catch (error) {
      res.status(401).json({ status: 401, error });
    }
  });

// =============================================================================
// Change password for User
// =============================================================================

app.post("/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  try {
    const validAdmin = await User.findOne({ _id: id, verifyToken: token });
    const verifyToken = jwt.verify(token, secretKey);

    if (validAdmin && verifyToken._id) {

      // Update the password directly without hashing
      const updatedAdmin = await User.findByIdAndUpdate(id, { password });
      
      res.status(201).json({ status: 201, updatedAdmin });
    } else {
      res.status(401).json({ status: 401, message: "User not exist or token invalid." });
    }
  } catch (error) {
    res.status(500).json({ status: 500, message: "Internal server error", error });
  }
});



// =======================================================================================
// Router for Leave Application
// =======================================================================================
app.post("/leave-application", async (req, res) => {
  const { employeeId,department,leaveType,totalDays,leaveBalance,startDate, endDate, dateOfApplication, reason, remarks,status, applicantName} = req.body;
  

  try {
      const existingData= await LeaveApplication.findOne({employeeId,status:'Pending'});
      if (existingData) {
          
          return res.status(400).json({ message: "Your leave request already exists." });
      }

      const newData = new LeaveApplication({ employeeId,department,leaveType,totalDays,leaveBalance,startDate, endDate, dateOfApplication,reason,remarks, status, applicantName});
      await newData.save();
      res.status(201).json({ message: "Request saved successfully." });
      
  } catch (error) {
      console.error("Error in data entry:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

// ==========================================================================
// Router for fetching leave applications
// ==========================================================================
app.get('/leave-request-data', async (req, res) => {
  try {
    const leaveRequests = await LeaveApplication.find()
      .populate('employeeId')
      .populate('leaveType');
    res.json(leaveRequests);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching leave requests' });
  }
});

// =====================================================================================
// Router for editing leave request data by Id
// =====================================================================================
app.get('/leave-request-data/:id', async (req, res) => { 
  try {
    const data = await LeaveApplication.findById(req.params.id);
    if (data == null) {
      return res.status(404).json({ message: 'Data not found' });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==============================================================================
// Router for Leave type details
// ==============================================================================
app.post("/leave-type", async (req, res) => {
  const { leaveName, description, totalDays, status} = req.body;

  try {
      const existingData= await LeaveType.findOne({leaveName, status:'Active'});
      if (existingData) {
          
          return res.status(400).json({ message: "Data exists." });
      }

      const newData = new LeaveType({leaveName, description, totalDays, status});
      await newData.save();
      res.status(201).json({ message: "Data saved successfully." });
      
  } catch (error) {
      console.error("Error in data entry:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

// ==================================================================================
// Router for getting all leave type data
// ==================================================================================
app.get("/leave-type-data", async (req, res) => {
  try {
      const data = await LeaveType.find()
      res.status(200).json(data);
  } catch (error) {
      console.error("Error in data retrieval:", error);
      res.status(500).json({ message: "Internal server error" });
  }
})


// ==============================================================================
//Router for getting leave type details by Id
// ==============================================================================
app.get('/Edit-leave-type/:id', async (req, res) => { 
  try {
    
    const data = await LeaveType.findById(req.params.id);
    if (data == null) {
      return res.status(404).json({ message: 'Data not found' });
    }
    res.json(data);
  } catch (err) {

    console.error("Error retrieving leave details:",err);
    res.status(500).json({ message: err.message });
  }
});


// =====================================================================
// Update leave type by id
// =====================================================================
app.put('/Update-leave-type/:id', async (req, res) => {
  try {
      const {description,totalDays,status } = req.body;
      await LeaveType.findByIdAndUpdate(req.params.id, {description,totalDays,status });
    res.json({ message: 'Record updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =====================================================================
// Update leave application data by manager finding record id
// =====================================================================
app.put('/Update-leave-request-data/:id', async (req, res) => {
  try {
      const {leaveBalance,remarks,status } = req.body;
      await LeaveApplication.findByIdAndUpdate(req.params.id, {leaveBalance,remarks,status });
    res.json({ message: 'Record updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =================================================================
app.get('/ManagerAccount', async (req, res) => {
  try {
      const accounts = await User.find({ role: "Manager", status: "Active" }).select('name email');
      if (!accounts || accounts.length === 0) {
          return res.status(404).json({ message: 'No active manager found' });
      }
      res.status(200).json(accounts);
  } catch (error) {
      console.error('Error fetching accounts:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});



// =============================================================
// Port Name
// =============================================================
app.listen(5000, () => console.log("Server is running on port 5000"))