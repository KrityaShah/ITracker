const User = require("../model/user-model");
const bcrypt = require("bcryptjs");
const Expense = require('../model/expense-model')

const home = async (req, res) => {
  try {
    res.status(200).json({ message: "Hello world via controller" });
  } catch (error) {
    console.error(error);
  }
};

const register = async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;

    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({ message: "User Already Exists!" });
    }
    const saltRound = 10;
    const hashPassword = await bcrypt.hash(password, saltRound);

    const userCreated = await User.create({
      username,
      email,
      phone,
      password: hashPassword,
    });

    res
      .status(200)
      .json({
        message: "Registration Sucessfull",
        token: await userCreated.generateToken(),
        userId: userCreated._id.toString(),
      });
  } catch (error) {
    console.error(error);
  }
};


const login = async (req, res) =>{
    try {
        const {email, password} = req.body;

        const userExist = await User.findOne({email})

        if(!userExist){
            return res.status(400).json({message: "Invalid, Please try it later"});
        }
        const isPasswordValid = await bcrypt.compare(password, userExist.password );
        
        if(isPasswordValid){
            return res.status(200).json({
                  message: "Login sucessfull",
                  token : await userExist.generateToken(),
                  userId: userExist._id.toString(),
              })
          }else{
            return res.status(401).json({message: "invalid Credentail"});
          }
    } catch (error) {
        console.error(error);
        
    }
}


const createExpenses = async (req, res) =>{
  
    try{
    //  const {userId} = req.user;
    const {title, description, amount, category } = req.body;

    if(!title || !description){
      return res.status(400).json({message: "Title and description must be filled"})
    }

   

    const expensesCreate = await Expense.create({ title, description, amount, category});
    return res.status(200).json({message: "Expenses Added!"});

    }catch(error){
      console.error(error);
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const getExpenses = async (req,res) =>{
  try {
    const expenses = await Expense.find();

    if(!expenses){
      return res.status(400).json({message: "No expenses at the moment"});
    }

    return res.status(200).json({expenses});

  } catch (error) {
    console.error(error);
    
  }
}

module.exports = { home, register, login , createExpenses, getExpenses};
