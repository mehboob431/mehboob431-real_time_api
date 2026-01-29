import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/logo2.png';
import globalConstantUtil from '../../globalConstantUtils.js';

const LoginForm = () => {
  const { login } = useAuth();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().required('Required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await axios.post(globalConstantUtil.baseUrl + '/auth/login', values);
        login(res.data);
      } catch (error) {
        console.error('Login failed', error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 px-4">
      <div className="bg-gray-800 p-8 md:p-14 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="h-16" />
        </div>

        <div className="text-3xl md:text-4xl font-semibold text-gray-300 text-center mb-6">
          LOGIN
        </div>

        <form className="space-y-6" onSubmit={formik.handleSubmit}>
          {/* Email Input */}
          <div className="flex items-center border border-gray-600 rounded-lg bg-gradient-to-b from-gray-800 to-gray-700">
            <div className="p-3 text-gray-400">
              <i className="fas fa-envelope"></i>
            </div>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className={`w-full h-12 text-gray-400 bg-transparent outline-none border-l border-gray-600 p-2 ${
                formik.touched.email && formik.errors.email
                  ? 'ring-2 ring-red-500'
                  : 'focus:ring-2 focus:ring-green-500'
              }`}
            />
          </div>
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 text-sm">{formik.errors.email}</div>
          )}

          {/* Password Input */}
          <div className="flex items-center border border-gray-600 rounded-lg bg-gradient-to-b from-gray-800 to-gray-700">
            <div className="p-3 text-gray-400">
              <i className="fas fa-lock"></i>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className={`w-full h-12 text-gray-400 bg-transparent outline-none border-l border-gray-600 p-2 ${
                formik.touched.password && formik.errors.password
                  ? 'ring-2 ring-red-500'
                  : 'focus:ring-2 focus:ring-green-500'
              }`}
            />
          </div>
          {formik.touched.password && formik.errors.password && (
            <div className="text-red-500 text-sm">{formik.errors.password}</div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-gray-100 font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Logging in...' : 'LOGIN'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
