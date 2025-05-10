import React, { useState, useEffect } from 'react';
import addressData from '../../data/address.json';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

// Định nghĩa schema validation với Yup
const addressSchema = Yup.object().shape({
  province: Yup.string()
      .required('眼光/Thành phố không được để trống')
      .min(2, 'Tỉnh/Thành phố phải có ít nhất 2 ký tự')
      .max(50, 'Tỉnh/Thành phố không được vượt quá 50 ký tự'),
  district: Yup.string()
      .required('Quận/Huyện không được để trống')
      .min(2, 'Quận/Huyện phải có ít nhất 2 ký tự')
      .max(50, 'Quận/Huyện không được vượt quá 50 ký tự'),
  ward: Yup.string()
      .required('Phường/Xã không được để trống')
      .min(2, 'Phường/Xã phải có ít nhất 2 ký tự')
      .max(50, 'Phường/Xã không được vượt quá 50 ký tự'),
  hamlet: Yup.string()
      .max(100, 'Thôn/Xóm không được vượt quá 100 ký tự')
      .optional(),
  address: Yup.string()
      .required('Địa chỉ không được để trống')
      .min(2, 'Địa chỉ phải có ít nhất 2 ký tự')
      .max(100, 'Địa chỉ không được vượt quá 100 ký tự'),
  postalCode: Yup.string()
      .required('Mã bưu điện không được để trống')
      .matches(/^\d{5}$/, 'Mã bưu điện phải là 5 chữ số'),
});

// Định nghĩa kiểu cho field trong onChange
type AddressField = 'province' | 'district' | 'ward' | 'hamlet' | 'address' | 'postalCode';

interface AddressCardProps {
  province: string;
  district: string;
  ward: string;
  hamlet: string;
  address: string;
  postalCode?: string;
  isEditMode: boolean;
  onChange: (field: AddressField, value: string) => void; // Sử dụng AddressField thay vì string
}

interface District {
  name: string;
  ward: string[];
}

interface Province {
  name: string;
  district: District[];
}

const AddressCard: React.FC<AddressCardProps> = ({
                                                   province,
                                                   district,
                                                   ward,
                                                   hamlet,
                                                   address,
                                                   postalCode,
                                                   isEditMode,
                                                   onChange,
                                                 }) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<string[]>([]);

  // Khởi tạo React Hook Form
  const {
    register,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(addressSchema),
    defaultValues: {
      province,
      district,
      ward,
      hamlet,
      address,
      postalCode,
    },
  });

  // Load provinces
  useEffect(() => {
    if (addressData.province) {
      setProvinces(addressData.province);
    }
  }, []);

  // Update districts when province changes
  useEffect(() => {
    const selectedProvince = provinces.find((p) => p.name === province);
    const newDistricts = selectedProvince ? selectedProvince.district : [];
    setDistricts(newDistricts);
    if (district && !newDistricts.some((d) => d.name === district)) {
      onChange('district', '');
      setValue('district', '');
      onChange('ward', '');
      setValue('ward', '');
    }
    setWards([]);
  }, [province, provinces, district, onChange, setValue]);

  // Update wards when district changes
  useEffect(() => {
    const selectedDistrict = districts.find((d) => d.name === district);
    const newWards = selectedDistrict ? selectedDistrict.ward : [];
    setWards(newWards);
    if (ward && !newWards.includes(ward)) {
      onChange('ward', '');
      setValue('ward', '');
    }
  }, [district, districts, ward, onChange, setValue]);

  const fields = [
    {
      label: 'Tỉnh/Thành phố',
      key: 'province' as AddressField, // Ép kiểu để khớp với AddressField
      type: 'select',
      options: provinces.map((p) => ({ value: p.name, label: p.name })),
    },
    {
      label: 'Quận/Huyện',
      key: 'district' as AddressField,
      type: 'select',
      options: districts.map((d) => ({ value: d.name, label: d.name })),
    },
    {
      label: 'Phường/Xã',
      key: 'ward' as AddressField,
      type: 'select',
      options: wards.map((w) => ({ value: w, label: w })),
    },
    { label: 'Thôn/Xóm', key: 'hamlet' as AddressField, type: 'text' },
    { label: 'Địa chỉ', key: 'address' as AddressField, type: 'text' },
    { label: 'Mã bưu điện', key: 'postalCode' as AddressField, type: 'text' },
  ];

  return (
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-800">Địa chỉ</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map(({ label, key, type, options }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                {isEditMode ? (
                    type === 'select' ? (
                        <div>
                          <select
                              {...register(key)}
                              onChange={(e) => {
                                onChange(key, e.target.value);
                                setValue(key, e.target.value);
                              }}
                              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                              aria-label={label}
                              disabled={key !== 'province' && !province}
                          >
                            <option value="">Chọn {label}</option>
                            {options?.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                            ))}
                          </select>
                          {errors[key] && (
                              <p className="text-red-500 text-sm mt-1">{errors[key]?.message}</p>
                          )}
                        </div>
                    ) : (
                        <div>
                          <input
                              type="text"
                              {...register(key)}
                              onChange={(e) => {
                                onChange(key, e.target.value);
                                setValue(key, e.target.value);
                              }}
                              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                              aria-label={label}
                          />
                          {errors[key] && (
                              <p className="text-red-500 text-sm mt-1">{errors[key]?.message}</p>
                          )}
                        </div>
                    )
                ) : (
                    <p className="py-2 px-4 bg-gray-50 rounded">
                      {(key === 'province'
                          ? province
                          : key === 'district'
                              ? district
                              : key === 'ward'
                                  ? ward
                                  : key === 'hamlet'
                                      ? hamlet
                                      : key === 'address'
                                          ? address
                                          : postalCode) || 'Chưa cập nhật'}
                    </p>
                )}
              </div>
          ))}
        </div>
      </div>
  );
};

export default AddressCard;