import * as mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
    
    name: {
        type: String,
        require: true
    },
    surName: {
        type: String,
        require: true,
    },
    participation: {
        type: Number,
        require: true
    }
});

export default mongoose.model('Employee', EmployeeSchema, 'Employee');