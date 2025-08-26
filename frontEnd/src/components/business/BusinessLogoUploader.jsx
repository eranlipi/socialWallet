import React, { useContext, useState } from 'react';
import { Modal, Box } from '@material-ui/core';
import MyAvatarUploader from '../common/MyAvatarUploader';
import api from '../../helpers/api';
import { getImageBlob } from '../../helpers/fileUpload';
import { AlertContext } from '../../Routes';

const BusinessLogoUploader = ({ open, onClose }) => {
  const { setAlertMsg, setAlertType, setAlertOpen } = useContext(AlertContext);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file) => {
    const blobResponse = await getImageBlob(file);
    if (blobResponse.success) {
      const formData = new FormData();
      formData.append('logo', blobResponse.data);
      setUploading(true);
      const response = await api.business.uploadLogo(formData);
      if (response.type === 'success') {
        setAlertMsg(response.msg);
        setAlertType('success');
        setAlertOpen(true);
        onClose();
      } else {
        setAlertMsg(response.msg);
        setAlertType('error');
        setAlertOpen(true);
      }
      setUploading(false);
    } else {
      setAlertMsg('Error preparing image upload');
      setAlertType('error');
      setAlertOpen(true);
    }
  };

  return (
    <Modal open={open}>
      <Box style={{ position: 'absolute', top: '20%', left: '40%' }}>
        <MyAvatarUploader
          onClose={onClose}
          onUpload={(file) => handleUpload(file)}
          updating={uploading}
        />
      </Box>
    </Modal>
  );
};

export default BusinessLogoUploader;

