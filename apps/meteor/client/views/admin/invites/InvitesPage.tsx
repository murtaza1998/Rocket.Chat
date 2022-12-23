import { States, StatesIcon, StatesTitle, StatesActions, StatesAction } from '@rocket.chat/fuselage';
import { useMediaQuery } from '@rocket.chat/fuselage-hooks';
import { useSetModal, useToastMessageDispatch, useTranslation, useEndpoint } from '@rocket.chat/ui-contexts';
import { useQuery } from '@tanstack/react-query';
import type { ReactElement } from 'react';
import React, { useMemo } from 'react';

import GenericModal from '../../../components/GenericModal';
import {
	GenericTable,
	GenericTableBody,
	GenericTableHeader,
	GenericTableHeaderCell,
	GenericTableLoadingTable,
} from '../../../components/GenericTable';
import Page from '../../../components/Page';
import InviteRow from './InviteRow';

const InvitesPage = (): ReactElement => {
	const t = useTranslation();
	const dispatchToastMessage = useToastMessageDispatch();
	const setModal = useSetModal();

	const getInvitesList = useEndpoint('GET', '/v1/listInvites');
	const { data, isLoading, isSuccess, isError, refetch } = useQuery(['getInvitesList'], () => getInvitesList());

	const onRemove = (removeInvite: () => Promise<boolean>): void => {
		const confirmRemove = async (): Promise<void> => {
			try {
				await removeInvite();
				dispatchToastMessage({ type: 'success', message: t('Invite_removed') });
				refetch();
			} catch (error) {
				if (typeof error === 'string' || error instanceof Error) {
					dispatchToastMessage({ type: 'error', message: error });
				}
			} finally {
				setModal();
			}
		};

		setModal(
			<GenericModal
				title={t('Are_you_sure')}
				children={t('Are_you_sure_you_want_to_delete_this_record')}
				variant='danger'
				confirmText={t('Yes')}
				cancelText={t('No')}
				onClose={(): void => setModal()}
				onCancel={(): void => setModal()}
				onConfirm={confirmRemove}
			/>,
		);
	};

	const notSmall = useMediaQuery('(min-width: 768px)');

	const headers = useMemo(
		() => [
			<GenericTableHeaderCell w={notSmall ? '20%' : '80%'}>{t('Token')}</GenericTableHeaderCell>,
			notSmall && [
				<GenericTableHeaderCell w='35%'>{t('Created_at')}</GenericTableHeaderCell>,
				<GenericTableHeaderCell w='20%'>{t('Expiration')}</GenericTableHeaderCell>,
				<GenericTableHeaderCell w='10%'>{t('Uses')}</GenericTableHeaderCell>,
				<GenericTableHeaderCell w='10%'>{t('Uses_left')}</GenericTableHeaderCell>,
				<GenericTableHeaderCell />,
			],
		],
		[notSmall, t],
	);

	return (
		<Page>
			<Page.Header title={t('Invites')} />
			<Page.Content>
				<>
					{isLoading && (
						<GenericTable>
							<GenericTableHeader>{headers}</GenericTableHeader>
							<GenericTableBody>
								<GenericTableLoadingTable headerCells={4} />
							</GenericTableBody>
						</GenericTable>
					)}

					{isSuccess && data && data.length > 0 && (
						<GenericTable>
							<GenericTableHeader>{headers}</GenericTableHeader>
							<GenericTableBody>
								{isLoading && <GenericTableLoadingTable headerCells={notSmall ? 4 : 1} />}
								{data.map((invite) => (
									<InviteRow key={invite._id} {...invite} onRemove={onRemove} />
								))}
							</GenericTableBody>
						</GenericTable>
					)}

					{isSuccess && data && data.length === 0 && (
						<States>
							<StatesIcon name='magnifier' />
							<StatesTitle>{t('No_results_found')}</StatesTitle>
						</States>
					)}

					{isError && (
						<States>
							<StatesIcon name='warning' variation='danger' />
							<StatesTitle>{t('Something_went_wrong')}</StatesTitle>
							<StatesActions>
								<StatesAction onClick={() => refetch()}>{t('Reload_page')}</StatesAction>
							</StatesActions>
						</States>
					)}
				</>
			</Page.Content>
		</Page>
	);
};

export default InvitesPage;
