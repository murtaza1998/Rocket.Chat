import { Box, MessageGenericPreviewImage } from '@rocket.chat/fuselage';
import type { ReactElement } from 'react';
import React from 'react';

import { useMessageOembedMaxHeight, useMessageOembedMaxWidth } from '../../../../views/room/contexts/MessageContext';
import type { UrlPreviewMetadata } from './UrlPreviewMetadata';

const UrlImagePreview = ({ url }: Pick<UrlPreviewMetadata, 'url'>): ReactElement => {
	const oembedMaxWidth = useMessageOembedMaxWidth();
	const oembedMaxHeight = useMessageOembedMaxHeight();

	return (
		<Box maxHeight={oembedMaxHeight} maxWidth={oembedMaxWidth}>
			<MessageGenericPreviewImage className='gallery-item' url={url || ''} />
		</Box>
	);
};

export default UrlImagePreview;
