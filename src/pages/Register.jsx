import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../hooks/useAuth';

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (email, password) => {
    try {
      await register(email, password);
      navigate('/'); 
    } catch (error) {
      console.error('Registration failed:', error.response?.data?.message || error.message);
      alert('Registration failed: ' + (error.response?.data?.message || 'Please try again'));
    }
  };

  return <AuthForm onSubmit={handleRegister} buttonText="Register" />;
}

export default Register;