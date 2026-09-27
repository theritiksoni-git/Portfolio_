import React from 'react';
import ContactSection from '../components/sections/ContactSection';

const ContactPage = ({ onOpenResume }) => {
  return (
    <div className="pt-24 sm:pt-28 pb-16 cinematic-page-enter">
      <ContactSection onOpenResume={onOpenResume} isStandalonePage={true} />
    </div>
  );
};

export default ContactPage;
