import React, { useState } from 'react';
import Avatar from "../../assets/default-avatar.svg";

const MyImage = ({ src, ...rest }) => {
    const [imageSource, setImageSource] = useState(src);

    return (
        <img
            src={imageSource}
            onError={(error) => setImageSource(Avatar)}
            {...rest}
        />
    );
};

export default MyImage;