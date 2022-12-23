import { MessageMetricsItem, MessageBlock, MessageMetrics, MessageMetricsReply, MessageMetricsFollowing } from '@rocket.chat/fuselage';
import { useToastMessageDispatch, useTranslation } from '@rocket.chat/ui-contexts';
import type { ReactElement, UIEvent } from 'react';
import React, { useCallback } from 'react';

import { useTimeAgo } from '../../../hooks/useTimeAgo';
import { useToggleFollowingThreadMutation } from '../../../views/room/contextualBar/Threads/hooks/useToggleFollowingThreadMutation';
import { followStyle, anchor } from '../helpers/followSyle';
import { useBlockRendered } from '../hooks/useBlockRendered';
import AllMentionNotification from '../notification/AllMentionNotification';
import MeMentionNotification from '../notification/MeMentionNotification';
import UnreadMessagesNotification from '../notification/UnreadMessagesNotification';

type ThreadMetricsProps = {
	unread: boolean;
	mention: boolean;
	all: boolean;
	lm: Date;
	mid: string;
	rid: string;
	counter: number;
	participants: number;
	following: boolean;
	openThread: (e: UIEvent) => void;
};

const ThreadMetrics = ({
	unread,
	mention,
	all,
	rid,
	mid,
	counter,
	participants,
	following,
	lm,
	openThread,
}: ThreadMetricsProps): ReactElement => {
	const { className, ref } = useBlockRendered<HTMLDivElement>();
	const t = useTranslation();

	const format = useTimeAgo();

	const dispatchToastMessage = useToastMessageDispatch();
	const toggleFollowingThreadMutation = useToggleFollowingThreadMutation({
		onError: (error) => {
			dispatchToastMessage({ type: 'error', message: error });
		},
	});

	const handleFollow = useCallback(() => {
		toggleFollowingThreadMutation.mutate({ tmid: mid, follow: !following });
	}, [following, mid, toggleFollowingThreadMutation]);

	return (
		<MessageBlock className={followStyle}>
			<div className={className} ref={ref} />
			<MessageMetrics>
				<MessageMetricsReply data-rid={rid} data-mid={mid} onClick={openThread}>
					{t('Reply')}
				</MessageMetricsReply>
				<MessageMetricsItem title={t('Replies')}>
					<MessageMetricsItem.Icon name='thread' />
					<MessageMetricsItem.Label>{counter}</MessageMetricsItem.Label>
				</MessageMetricsItem>
				{!!participants && (
					<MessageMetricsItem title={t('Participants')}>
						<MessageMetricsItem.Icon name='user' />
						<MessageMetricsItem.Label>{participants}</MessageMetricsItem.Label>
					</MessageMetricsItem>
				)}
				<MessageMetricsItem title={lm?.toLocaleString()}>
					<MessageMetricsItem.Icon name='clock' />
					<MessageMetricsItem.Label>{format(lm)}</MessageMetricsItem.Label>
				</MessageMetricsItem>
				<MessageMetricsItem
					className={!following ? anchor : undefined}
					title={t(following ? 'Following' : 'Not_following')}
					data-rid={rid}
					onClick={handleFollow}
				>
					<MessageMetricsFollowing name={following ? 'bell' : 'bell-off'} />
				</MessageMetricsItem>
				<MessageMetricsItem>
					<MessageMetricsItem.Label>
						{(mention && <MeMentionNotification />) || (all && <AllMentionNotification />) || (unread && <UnreadMessagesNotification />)}
					</MessageMetricsItem.Label>
				</MessageMetricsItem>
			</MessageMetrics>
		</MessageBlock>
	);
};

export default ThreadMetrics;
