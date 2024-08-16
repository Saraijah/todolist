import bcrypt from 'bcrypt';

// Function to hash a password
const hashPassword = (password) => {
  try {
    // Generate a salt
    const saltRounds = 10; // 10 is the recommended number of salt rounds
    const salt = bcrypt.genSaltSync(saltRounds);

    console.log('Generated Salt:', salt); // Debugging: Log the generated salt

    // Hash the password with the generated salt
    const hashedPassword = bcrypt.hashSync(password, salt);

    console.log('Hashed Password:', hashedPassword); // Debugging: Log the hashed password

    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw error;
  }
};

// Function to compare a plain password with a hashed password
const comparePasswords = async (plainPassword, hashedPassword) => {
  try {
    // Compare the plain password with the hashed password
    const isPasswordValid = await bcrypt.compare(plainPassword, hashedPassword);
    return isPasswordValid;
  } catch (error) {
    console.error('Error comparing passwords:', error);
    throw error;
  }
};

export { hashPassword, comparePasswords };
