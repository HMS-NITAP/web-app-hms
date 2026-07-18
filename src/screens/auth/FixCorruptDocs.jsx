import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import MainButton from '../../components/common/MainButton';
import { MAX_FEE_RECEIPT_FILE_SIZE } from '../../config/config';
import { fixDocLogin, fixDocUpload } from '../../services/operations/FixCorruptDocsAPI';

const FixCorruptDocs = () => {
  const [step, setStep] = useState('login'); // 'login' | 'upload' | 'done'
  const [secureText, setSecureText] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [token, setToken] = useState(null);
  const [student, setStudent] = useState(null);
  const [file, setFile] = useState(null);

  const onLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error('Email and password are required.');
      return;
    }
    setIsButtonDisabled(true);
    const result = await fixDocLogin(email.trim(), password, toast);
    setIsButtonDisabled(false);
    if (result?.token) {
      setToken(result.token);
      setStudent(result.student);
      setPassword('');
      setStep('upload');
    }
  };

  const onFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) {
      setFile(null);
      return;
    }
    if (selected.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed.');
      e.target.value = '';
      setFile(null);
      return;
    }
    if (selected.size > MAX_FEE_RECEIPT_FILE_SIZE) {
      toast.error('File too large. Maximum allowed size is 250 KB.');
      e.target.value = '';
      setFile(null);
      return;
    }
    setFile(selected);
  };

  const onUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select your Institute Fee Receipt (PDF).');
      return;
    }
    const formData = new FormData();
    formData.append('instituteFeeReceipt', file);
    setIsButtonDisabled(true);
    const ok = await fixDocUpload(formData, token, toast);
    setIsButtonDisabled(false);
    if (ok) {
      setToken(null);
      setFile(null);
      setStep('done');
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-xl font-bold text-gray-800">Fix Corrupted Document</h1>
          <p className="text-sm text-gray-600">
            Some of the documents you uploaded during registration was found to be corrupt or
            unreadable during automated verification. Please log in to review and re-upload the affected
            document. This can be done only once.
          </p>
        </div>

        {step === 'login' && (
          <form onSubmit={onLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email ID <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your Institute Email ID"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type={secureText ? 'password' : 'text'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <div
                className="absolute right-3 top-9 cursor-pointer text-gray-400"
                onClick={() => setSecureText(!secureText)}
              >
                {secureText ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </div>
            </div>

            <div className="w-full flex justify-center">
              <MainButton text="Verify" type="submit" isButtonDisabled={isButtonDisabled} width="w-full" />
            </div>
          </form>
        )}

        {step === 'upload' && (
          <form onSubmit={onUpload} className="space-y-6">
            {student && (
              <div className="text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-md p-3">
                <p><span className="font-semibold">Name:</span> {student.name}</p>
                <p><span className="font-semibold">Roll No:</span> {student.rollNo}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-700 mb-2">
                The following document needs to be re-uploaded:
              </p>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Institute Fee Receipt (PDF, max 250 KB) <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={onFileChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <p className="text-xs text-red-500">
              Note: You can upload only once. Make sure you select the correct file before submitting.
            </p>
            <div className="w-full flex justify-center">
              <MainButton text="Upload" type="submit" isButtonDisabled={isButtonDisabled} width="w-full" />
            </div>
          </form>
        )}

        {step === 'done' && (
          <div className="text-center space-y-2">
            <p className="text-green-600 font-semibold">Your document has been updated successfully.</p>
            <p className="text-sm text-gray-600">You may now close this page.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FixCorruptDocs;
