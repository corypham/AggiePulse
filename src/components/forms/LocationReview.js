import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const schema = yup.object({
  rating: yup.number().required().min(1).max(5),
  comment: yup.string().required().min(10),
}); 