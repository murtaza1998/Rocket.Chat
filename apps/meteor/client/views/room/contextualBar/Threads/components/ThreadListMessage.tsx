import type { IMessage } from '@rocket.chat/core-typings';
import { Message, Box, IconButton } from '@rocket.chat/fuselage';
import { useTranslation } from '@rocket.chat/ui-contexts';
import type { ComponentProps, MouseEventHandler, ReactElement, ReactNode } from 'react';
import React, { memo } from 'react';

import RawText from '../../../../../components/RawText';
import UserAvatar from '../../../../../components/avatar/UserAvatar';
import * as NotificationStatus from '../../../../../components/message/NotificationStatus';
import { followStyle, anchor } from '../../../../../components/message/helpers/followSyle';
import { useTimeAgo } from '../../../../../hooks/useTimeAgo';

type ThreadListMessageProps = {
	_id: IMessage['_id'];
	msg: IMessage['msg'];
	following: boolean;
	username: IMessage['u']['username'];
	name?: IMessage['u']['name'];
	ts: IMessage['ts'];
	replies: ReactNode;
	participants: ReactNode;
	handleFollowButton: MouseEventHandler;
	unread: boolean;
	mention: boolean;
	all: boolean;
	tlm: Date | undefined;
} & Omit<ComponentProps<typeof Box>, 'is'>;

const ThreadListMessage = ({
	_id,
	msg,
	following,
	username,
	name = username,
	ts,
	replies,
	participants,
	handleFollowButton,
	unread,
	mention,
	all,
	tlm,
	className = [],
	...props
}: ThreadListMessageProps): ReactElement => {
	const t = useTranslation();
	const formatDate = useTimeAgo();

	const button = !following ? 'bell-off' : 'bell';
	const actionLabel = t(!following ? 'Not_Following' : 'Following');
	return (
		<Box className={[className, !following && followStyle].flat()}>
			<Box pbs='x16' is={Message} {...props}>
				<Message.LeftContainer>
					<UserAvatar username={username} className='rcx-message__avatar' size='x36' />
				</Message.LeftContainer>
				<Message.Container>
					<Message.Header>
						<Message.Name title={username}>{name}</Message.Name>
						<Message.Timestamp>{formatDate(ts)}</Message.Timestamp>
					</Message.Header>
					<Message.Body clamp={2}>
						<RawText>{msg}</RawText>
					</Message.Body>
					<Message.Block>
						<Message.Metrics>
							<Message.Metrics.Item>
								<Message.Metrics.Item.Icon name='thread' />
								<Message.Metrics.Item.Label>{replies}</Message.Metrics.Item.Label>
							</Message.Metrics.Item>
							<Message.Metrics.Item>
								<Message.Metrics.Item.Icon name='user' />
								<Message.Metrics.Item.Label>{participants}</Message.Metrics.Item.Label>
							</Message.Metrics.Item>
							{tlm && (
								<Message.Metrics.Item>
									<Message.Metrics.Item.Icon name='clock' />
									<Message.Metrics.Item.Label>{formatDate(tlm)}</Message.Metrics.Item.Label>
								</Message.Metrics.Item>
							)}
						</Message.Metrics>
					</Message.Block>
				</Message.Container>
				<Message.ContainerFixed>
					<IconButton
						className={anchor}
						small
						icon={button}
						flexShrink={0}
						data-following={following}
						data-id={_id}
						onClick={handleFollowButton}
						title={actionLabel}
						aria-label={actionLabel}
					/>
					<Box mb={24}>
						{(mention && <NotificationStatus.Me />) || (all && <NotificationStatus.All />) || (unread && <NotificationStatus.Unread />)}
					</Box>
				</Message.ContainerFixed>
			</Box>
		</Box>
	);
};

export default memo(ThreadListMessage);
