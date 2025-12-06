// src/components/profile/ClientProfileForm.tsx
"use client";

import type { ClientType, ContactMethod, CommunicationFrequency } from "@/types/user";
import { FormInput, FormSelect, FormSection } from "@/components/forms";

interface ClientProfileFormProps {
  clientType: ClientType;
  companyName: string;
  phone: string;
  timeZone: string;
  preferredContactMethod: ContactMethod;
  communicationFrequency: CommunicationFrequency;
  isEditing: boolean;
  onClientTypeChange: (type: ClientType) => void;
  onCompanyNameChange: (name: string) => void;
  onPhoneChange: (phone: string) => void;
  onTimeZoneChange: (tz: string) => void;
  onContactMethodChange: (method: ContactMethod) => void;
  onFrequencyChange: (freq: CommunicationFrequency) => void;
}

export default function ClientProfileForm({
  clientType,
  companyName,
  phone,
  timeZone,
  preferredContactMethod,
  communicationFrequency,
  isEditing,
  onClientTypeChange,
  onCompanyNameChange,
  onPhoneChange,
  onTimeZoneChange,
  onContactMethodChange,
  onFrequencyChange,
}: ClientProfileFormProps) {
  if (!isEditing) {
    return (
      <div className="mt-4 pt-4 border-t-2 border-gray-100">
        <h3 className="text-sm font-bold text-gray-700 mb-3">Client Information</h3>
        
        <div className="space-y-3">
          {/* Client Type Display */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200">
            <p className="text-xs uppercase tracking-wider text-[#FF4D28] font-bold mb-1">Client Type</p>
            <div className="flex items-center gap-2">
              {clientType === "company" ? (
                <>
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-semibold text-gray-700">🏢 Company</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-semibold text-gray-700">👤 Individual</span>
                </>
              )}
            </div>
          </div>

          {clientType === "company" && companyName && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200">
              <p className="text-xs uppercase tracking-wider text-[#FF4D28] font-bold mb-1">Company Name</p>
              <p className="text-sm font-semibold text-gray-700">{companyName}</p>
            </div>
          )}

          {phone && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200">
              <p className="text-xs uppercase tracking-wider text-[#FF4D28] font-bold mb-1">Phone Number</p>
              <p className="text-sm font-semibold text-gray-700">{phone}</p>
            </div>
          )}

          {timeZone && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200">
              <p className="text-xs uppercase tracking-wider text-[#FF4D28] font-bold mb-1">Time Zone</p>
              <p className="text-sm font-semibold text-gray-700">{timeZone}</p>
            </div>
          )}

          {preferredContactMethod && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200">
              <p className="text-xs uppercase tracking-wider text-[#FF4D28] font-bold mb-1">Preferred Contact</p>
              <p className="text-sm font-semibold text-gray-700 capitalize">{preferredContactMethod}</p>
            </div>
          )}

          {communicationFrequency && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200">
              <p className="text-xs uppercase tracking-wider text-[#FF4D28] font-bold mb-1">Communication</p>
              <p className="text-sm font-semibold text-gray-700 capitalize">
                {communicationFrequency === "as-needed" ? "As Needed" : communicationFrequency + " Updates"}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <FormSection title="Client Information" variant="bordered">
      {/* Client Type Radio Buttons */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Client Type</label>
        <div className="flex gap-4">
          <label className="flex-1 cursor-pointer">
            <input
              type="radio"
              name="clientType"
              value="individual"
              checked={clientType === "individual"}
              onChange={(e) => onClientTypeChange(e.target.value as ClientType)}
              className="sr-only peer"
            />
            <div className="flex items-center gap-3 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 transition-all duration-200 peer-checked:border-[#FF4D28] peer-checked:bg-[#FF4D28]/5">
              <svg className="w-5 h-5 text-gray-400 peer-checked:text-[#FF4D28]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold text-gray-700">Individual</span>
            </div>
          </label>
          <label className="flex-1 cursor-pointer">
            <input
              type="radio"
              name="clientType"
              value="company"
              checked={clientType === "company"}
              onChange={(e) => onClientTypeChange(e.target.value as ClientType)}
              className="sr-only peer"
            />
            <div className="flex items-center gap-3 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 transition-all duration-200 peer-checked:border-[#FF4D28] peer-checked:bg-[#FF4D28]/5">
              <svg className="w-5 h-5 text-gray-400 peer-checked:text-[#FF4D28]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold text-gray-700">Company</span>
            </div>
          </label>
        </div>
      </div>

      {clientType === "company" && (
        <FormInput
          label="Company Name"
          type="text"
          variant="rounded"
          value={companyName}
          onChange={(e) => onCompanyNameChange(e.target.value)}
          placeholder="Enter company name"
          required={clientType === "company"}
        />
      )}

      <FormInput
        label="Phone Number"
        type="tel"
        variant="rounded"
        value={phone}
        onChange={(e) => onPhoneChange(e.target.value)}
        placeholder="+1 (555) 123-4567"
      />

      <FormSelect
        label="Time Zone"
        variant="rounded"
        value={timeZone}
        onChange={(e) => onTimeZoneChange(e.target.value)}
      >
        <option value="America/New_York">Eastern Time (ET)</option>
        <option value="America/Chicago">Central Time (CT)</option>
        <option value="America/Denver">Mountain Time (MT)</option>
        <option value="America/Los_Angeles">Pacific Time (PT)</option>
        <option value="America/Anchorage">Alaska Time (AKT)</option>
        <option value="Pacific/Honolulu">Hawaii Time (HT)</option>
        <option value="Europe/London">London (GMT)</option>
        <option value="Europe/Paris">Paris (CET)</option>
        <option value="Asia/Tokyo">Tokyo (JST)</option>
        <option value="Asia/Shanghai">Shanghai (CST)</option>
        <option value="Asia/Kolkata">India (IST)</option>
        <option value="Australia/Sydney">Sydney (AEST)</option>
      </FormSelect>

      <FormSelect
        label="Preferred Contact Method"
        variant="rounded"
        value={preferredContactMethod}
        onChange={(e) => onContactMethodChange(e.target.value as ContactMethod)}
      >
        <option value="email">Email</option>
        <option value="phone">Phone Call</option>
        <option value="whatsapp">WhatsApp</option>
      </FormSelect>

      <FormSelect
        label="Communication Frequency"
        variant="rounded"
        value={communicationFrequency}
        onChange={(e) => onFrequencyChange(e.target.value as CommunicationFrequency)}
      >
        <option value="daily">Daily Updates</option>
        <option value="weekly">Weekly Updates</option>
        <option value="as-needed">As Needed</option>
      </FormSelect>
    </FormSection>
  );
}
