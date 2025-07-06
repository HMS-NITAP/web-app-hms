import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { createHostelBlock } from '../../services/operations/AdminAPI';
import MainButton from '../../components/common/MainButton';
import { MAX_HOSTEL_IMAGE_SIZE } from '../../config/config';

const CreateHostelBlock = () => {
  const seaterOptions = ['OneSeater', 'TwoSeater', 'FourSeater'];
  const floorOptions = [
    { label: 'G+2', value: 2 },
    { label: 'G+4', value: 4 },
  ];
  const yearOptions = [
    { label: '1st Year', value: 1 },
    { label: '2nd Year', value: 2 },
    { label: '3rd Year', value: 3 },
    { label: '4th Year', value: 4 },
  ];

  const { control, handleSubmit, formState: { errors }, reset } = useForm();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.Auth);

  const [file, setFile] = useState(null);
  const [roomType, setRoomType] = useState('');
  const [gender, setGender] = useState('M');
  const [floorCount, setFloorCount] = useState(2);
  const [year, setYear] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  function handleFileChange(e) {
      const file = e.target.files[0];
      if (file) {
          if (file.size > MAX_HOSTEL_IMAGE_SIZE) {
              toast('File size exceeds the limit of 500KB. Please select a smaller file.', { icon: '⚠️' });
          } else {
              setFile(file);
          }
      }
  }

  const submitHandler = async (data) => {
    if (!file) return toast.error("Please select an image");
    setIsButtonDisabled(true);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("image", file);
    formData.append("roomType", roomType);
    formData.append("gender", gender);
    formData.append("floorCount", floorCount);
    formData.append("capacity", data.capacity);
    formData.append("year", year);

    await dispatch(createHostelBlock(formData, token, toast));
    setFile(null);
    reset();
    setIsButtonDisabled(false);
  };

  return (
    <div className="w-full flex flex-col items-center py-10">
      <div className="md:w-[40%] w-[90%] bg-green-100 rounded-2xl p-4 mb-6">
        <p className="text-center font-semibold text-base text-black">
          Create a hostel block here. Please be careful while entering the details and ensure all data is accurate.
        </p>
      </div>
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="md:w-[50%] w-[95%] flex flex-col gap-6"
      >
        <div>
          <label className="font-semibold text-sm">Hostel Block Name *</label>
          <Controller
            control={control}
            name="name"
            rules={{ required: true }}
            render={({ field }) => (
              <input
                {...field}
                placeholder="Enter Hostel Block name"
                className="w-full border rounded-md p-2 text-black"
              />
            )}
          />
          {errors.name && <p className="text-red-600 text-sm">Name is required.</p>}
        </div>

        <div>
          <label className="font-semibold text-sm">Hostel Block Image *</label>
          <div className="flex w-full items-center justify-between gap-[1rem]">
              <input
                  type="file"
                  accept="image/jpeg,image/jpg"
                  onChange={handleFileChange}
                  className="max-w-[250px] px-[1rem] py-2 bg-blue-500 text-white font-semibold rounded-md cursor-pointer transition-transform duration-200 hover:scale-105"
              />
              {file ? (
                  <img src={URL.createObjectURL(file)} alt="Image Preview" className="w-20 h-20 rounded-full object-cover" />
              ) : (
                  <span className="font-bold text-black text-center">Select an Image</span>
              )}
          </div>
        </div>

        <div>
          <label className="font-semibold text-sm">Room Type *</label>
          <select
            className="w-full border rounded-md p-2"
            onChange={(e) => setRoomType(e.target.value)}
          >
            <option value="">Select Room Type</option>
            {seaterOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {errors.roomType && <p className="text-red-600 text-sm">Room Type is required.</p>}
        </div>

        <div>
          <label className="font-semibold text-sm">Gender *</label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="M"
                checked={gender === 'M'}
                onChange={() => setGender('M')}
              /> Male
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="F"
                checked={gender === 'F'}
                onChange={() => setGender('F')}
              /> Female
            </label>
          </div>
        </div>

        <div>
          <label className="font-semibold text-sm">Floor Count *</label>
          <select
            className="w-full border rounded-md p-2"
            onChange={(e) => setFloorCount(parseInt(e.target.value))}
          >
            {floorOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-semibold text-sm">Year Assigned *</label>
          <select
            className="w-full border rounded-md p-2"
            onChange={(e) => setYear(parseInt(e.target.value))}
          >
            {yearOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-semibold text-sm">Block Capacity *</label>
          <Controller
            control={control}
            name="capacity"
            rules={{ required: true }}
            render={({ field }) => (
              <input
                {...field}
                placeholder="Eg: 250"
                className="w-full border rounded-md p-2 text-black"
              />
            )}
          />
          {errors.capacity && <p className="text-red-600 text-sm">Capacity is required.</p>}
        </div>

        <MainButton text="Create Block" isButtonDisabled={isButtonDisabled} type="submit" />
      </form>
    </div>
  );
};

export default CreateHostelBlock;