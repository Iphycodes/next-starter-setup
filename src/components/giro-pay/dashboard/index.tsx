'use client';
import { Dispatch, SetStateAction, useState } from 'react';
import Link from 'next/link';
import moment from 'moment';
import { Button, Card, Col, List, Row, Select, Space, Tag } from 'antd';
import { numberFormat } from '@grc/_shared/helpers';
import { AccountNamespace } from '@grc/_shared/namespace/account';
import { IBalance, WalletNamespace } from '@grc/_shared/namespace/wallet';
import CustomModal from '@grc/_shared/components/custom-modal';
import { AuthDataType } from '@grc/_shared/namespace/auth';
import { CoinIcon } from '@grc/_shared/assets/svgs';
import { capitalize, isEmpty, startCase, toLower } from 'lodash';
import {
  CashFlowAnalytics,
  comparativeAnalysisData,
  mockTransactionAnalyticsData,
  mockTransactionAnalyticsData2,
  smoothLineChartData,
  statisticsFilter,
} from '@grc/_shared/constant';
import CreateWalletForm from './libs/create-wallet-form';
import {
  Chart as ChartJS,
  ArcElement,
  PointElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  Filler,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { CashFlowCard } from './libs/cash-flow-card';
import { QuickActionBtn } from './libs/quick-action-btn';
import { EmptyVirtualAccount } from './libs/empty-virtual-account';
import { motion } from 'framer-motion';
import TopUpBalance from '../disbursement/libs/top-up-balance';
import { Pagination } from '@grc/_shared/namespace';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';

type DashBoardProps = {
  authData?: AuthDataType | null;
  transactions: Record<string, any>[];
  setFilter: Dispatch<SetStateAction<string>>;
  currentAccount: AccountNamespace.Account | null;
  handleCreateWallet: (payload: Record<string, any>) => void;
  openCreateModal: boolean;
  setOpenCreateModal: Dispatch<SetStateAction<boolean>>;
  wallets: WalletNamespace.Wallet[];
  wallet: WalletNamespace.Wallet | null;
  loading: {
    isCreatingWallet: boolean;
    isLoadingWallets: boolean;
    isLoadingTotalBalance: boolean;
    isLoadingTransaction: boolean;
  };
  totalBalance: number | undefined;
  balance: IBalance;
  pagination: Pagination;
};

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler
);

const DashBoard = (props: DashBoardProps) => {
  const {
    transactions,
    authData,
    handleCreateWallet,
    openCreateModal,
    setOpenCreateModal,
    wallets,
    wallet,
    currentAccount,
    totalBalance,
    balance,
    loading,
  } = props;
  const [toggleTopUp, setToggleTopUp] = useState(false);
  const [toggleDisbursement, setToggleDisbursement] = useState(false);
  const isMobile = useMediaQuery(mediaSize.mobile);

  let delayed: any;
  const isVerified = !!authData?.bvn && !!authData?.mobile?.phoneNumber;
  return (
    <>
      <motion.div
        style={{ backgroundColor: 'transparent' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: 'spring', duration: 1 }}
        className="w-full"
      >
        <div className="w-full min-h-screen flex flex-col gap-5">
          <div>
            <div className="text-2xl">Hello 👋, {startCase(toLower(currentAccount?.name))}</div>
          </div>
          <Row gutter={[isMobile ? 10 : 20, 40]}>
            <Col md={6} xs={24}>
              <div className="flex flex-col gap-1">
                <span className=" text-4xl font-bold">
                  {totalBalance ? numberFormat(totalBalance / 100, '₦ ') : '₦ 0.00'}
                </span>
                <span>Total account balance from all wallets</span>
              </div>
            </Col>
            <Col md={6} xs={24}>
              {!isEmpty(wallets) && (
                <div className="flex flex-col gap-1 h-full justify-center">
                  <span className=" text-3xl font-semibold">
                    {balance?.availableAmount
                      ? numberFormat(balance.availableAmount / 100, '₦ ')
                      : '₦ 0.00'}
                  </span>
                  <span>Account balance from {startCase(toLower(wallet?.accountName))}</span>
                </div>
              )}
            </Col>
            <Col md={6} xs={12}>
              {isVerified && !isEmpty(wallets) && (
                <div className="w-full">
                  <Button
                    className="opacity-100 hover:opacity-70 bg-blue text-white h-14 rounded-lg font-semibold px-8"
                    type="primary"
                    block
                    onClick={() => setOpenCreateModal(true)}
                  >
                    Create A Wallet
                  </Button>
                </div>
              )}
            </Col>
            <Col md={6} xs={12}>
              {isVerified && !isEmpty(wallets) && (
                <div className="w-full">
                  <Button
                    className="opacity-100 hover:opacity-70 bg-blue text-white h-14 rounded-lg font-semibold px-8"
                    type="primary"
                    block
                    ghost
                    onClick={() => setToggleTopUp(true)}
                  >
                    Top Up Wallet
                  </Button>
                </div>
              )}
            </Col>
          </Row>

          {isEmpty(wallets) ? (
            <EmptyVirtualAccount
              isVerified={isVerified}
              handleCreateWallet={() => setOpenCreateModal(true)}
            />
          ) : (
            <>
              <Row gutter={[40, 40]} className="mt-3">
                <Col md={12} xs={24}>
                  <Row gutter={[isMobile ? 10 : 30, 30]}>
                    {CashFlowAnalytics?.map((data, index) => (
                      <Col key={`${data?.type}-${index}`} md={12} xs={12}>
                        <CashFlowCard type={data?.type} amount={data?.amount} count={data?.count} />
                      </Col>
                    ))}
                  </Row>
                </Col>
                <Col md={12} xs={24}>
                  <Row gutter={[isMobile ? 10 : 20, 20]} className="h-full">
                    <Col md={12} xs={12}>
                      <CashFlowCard type="Accrued Service Charge" amount={30000} count={5} />
                    </Col>
                    <Col md={12} xs={12}>
                      <div className="dark:bg-zinc-800 text-card-foreground w-full flex flex-col border dark:border-gray-500 shadow-md rounded-xl p-5 h-full">
                        <div className="flex flex-col">
                          <h3 className="font-medium text-sm tracking-tight">Quick Actions</h3>
                          <div className="flex gap-3 mt-3 flex-wrap">
                            <QuickActionBtn
                              title="send money"
                              icon={<CoinIcon />}
                              handleClick={() => setToggleDisbursement(true)}
                            />
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row gutter={[40, 40]} className="mt-3">
                <Col md={24} xs={24}>
                  <Card className="dark:bg-zinc-800 text-card-foreground w-full border dark:border-gray-500 shadow-md h-full">
                    <List
                      className="overflow-y-auto dark:text-white"
                      header={
                        <h3 className="font-semibold leading-none tracking-tight">
                          Recent transactions
                        </h3>
                      }
                      footer={
                        !isEmpty(transactions) ? (
                          <div className="text-center mt-5">
                            <Link
                              prefetch
                              className="text-blue"
                              href={'/apps/giro-pay/transactions'}
                            >
                              See all &rarr;
                            </Link>
                          </div>
                        ) : undefined
                      }
                      dataSource={transactions}
                      loading={false}
                      locale={{
                        emptyText: (
                          <div className="text-gray-500 text-justify dark:text-white">
                            <div>No Data Available</div>
                            <div>
                              Transaction insight will be shown here once you create a wallet and
                              commence pay-ins and pay-outs
                            </div>
                          </div>
                        ),
                      }}
                      renderItem={(item: Record<string, any>, index) => (
                        <List.Item className="dashboard-transaction-list" key={index}>
                          <div className="w-full flex justify-between items-center text-left px-2 py-0">
                            <List.Item.Meta
                              title={
                                <span className="text-card-foreground">
                                  {startCase(capitalize(item?.recipient))}
                                </span>
                              }
                              description={
                                <div className="flex items-center gap-3 text-card-foreground">
                                  <span>
                                    {moment(item?.createdAt).format('MMM DD, YYYY hh:mm A')}
                                  </span>
                                  <span>
                                    {' '}
                                    <Tag
                                      className=" min-w-[100px] text-center"
                                      color={
                                        item?.status === 'successful'
                                          ? 'success'
                                          : item?.status === 'processing'
                                            ? 'processing'
                                            : 'red'
                                      }
                                    >
                                      {item?.status}
                                    </Tag>
                                  </span>
                                </div>
                              }
                            />
                            <div className="text-card-foreground">
                              {item?.entry === 'debit' ? (
                                <span className=" text-red-700 font-semibold">- </span>
                              ) : (
                                <span className=" text-green-700 font-semibold">+ </span>
                              )}
                              {numberFormat(item?.amount / 100, '₦ ')}
                            </div>
                          </div>
                        </List.Item>
                      )}
                    />
                  </Card>
                </Col>
              </Row>
              <Row gutter={[40, 40]} className="mt-3">
                <Col md={12} xs={24}>
                  <Card className="dark:bg-zinc-800 text-card-foreground dark:text-white border dark:border-gray-500 shadow-md  h-full w-full">
                    <header className="flex flex-wrap gap-2 justify-between items-center">
                      <span className="font-bold">Cash Flow</span>
                      <div>
                        <Space size={7}>
                          <Select
                            loading={false}
                            options={statisticsFilter}
                            defaultValue={statisticsFilter[0]}
                            placeholder="Select a filter"
                          />
                        </Space>
                      </div>
                    </header>
                    <div className="mt-5 flex items-center justify-center dark:text-white">
                      <Line
                        height={120}
                        redraw
                        className="w-full"
                        options={{
                          responsive: true,
                          scales: {
                            x: {
                              grid: {
                                display: false,
                              },
                              type: 'category',
                              labels: [
                                'January',
                                'February',
                                'March',
                                'April',
                                'May',
                                'June',
                                'July',
                              ],
                            },
                            y: {
                              grid: {
                                display: false,
                              },
                              beginAtZero: true,
                            },
                          },
                          elements: {
                            line: {
                              cubicInterpolationMode: 'monotone',
                            },
                          },
                          plugins: {
                            legend: {
                              display: false,
                            },
                          },

                          animation: {
                            onComplete: () => {
                              delayed = true;
                            },
                            delay: (context: any) => {
                              let delay = 0;
                              if (
                                context.type === 'data' &&
                                context.mode === 'default' &&
                                !delayed
                              ) {
                                delay = context.dataIndex * 300 + context.datasetIndex * 100;
                              }
                              return delay;
                            },
                          },
                        }}
                        data={smoothLineChartData}
                      />
                    </div>
                  </Card>
                </Col>
                <Col md={12} xs={24}>
                  <Card className="dark:bg-zinc-800 text-card-foreground dark:text-white border dark:border-gray-500 shadow-md h-full w-full">
                    <header className="flex flex-wrap gap-2 justify-between items-center">
                      <h3 className="font-semibold leading-none tracking-tight">
                        Transaction Summary
                      </h3>
                      <div>
                        <Space size={7}>
                          <Select
                            loading={false}
                            options={statisticsFilter}
                            defaultValue={statisticsFilter[0]}
                            placeholder="Select a filter"
                          />
                        </Space>
                      </div>
                    </header>
                    <div className="mt-5 flex items-center justify-center">
                      <Doughnut
                        data={mockTransactionAnalyticsData}
                        redraw
                        width={400}
                        height={200}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'bottom',
                              align: 'center',
                            },
                          },

                          animation: {
                            onComplete: () => {
                              delayed = true;
                            },
                            delay: (context: any) => {
                              let delay = 0;
                              if (
                                context.type === 'data' &&
                                context.mode === 'default' &&
                                !delayed
                              ) {
                                delay = context.dataIndex * 300 + context.datasetIndex * 100;
                              }
                              return delay;
                            },
                          },
                        }}
                      />
                    </div>
                  </Card>
                </Col>
              </Row>
              <Row gutter={[40, 40]} className="mt-3">
                <Col md={12} xs={24}>
                  <Card className="dark:bg-zinc-800 text-card-foreground dark:text-white border dark:border-gray-500 shadow-md  hover:border-cyan-100">
                    <header className="flex flex-wrap gap-2 justify-between items-center">
                      <h3 className="font-semibold leading-none tracking-tight">
                        Transaction Summary
                      </h3>
                      <div>
                        <Space size={7}>
                          <Select
                            loading={false}
                            options={statisticsFilter}
                            defaultValue={statisticsFilter[0]}
                            placeholder="Select a filter"
                          />
                        </Space>
                      </div>
                    </header>
                    <div className="mt-5 flex items-center justify-center">
                      <Bar
                        redraw
                        className="w-full"
                        options={{
                          responsive: true,
                          scales: {
                            x: {
                              grid: {
                                display: false,
                              },
                            },
                            y: {
                              grid: {
                                display: false,
                              },
                            },
                          },
                          plugins: {
                            legend: {
                              position: 'bottom',
                              align: 'center',
                            },
                          },

                          animation: {
                            onComplete: () => {
                              delayed = true;
                            },
                            delay: (context: any) => {
                              let delay = 0;
                              if (
                                context.type === 'data' &&
                                context.mode === 'default' &&
                                !delayed
                              ) {
                                delay = context.dataIndex * 300 + context.datasetIndex * 100;
                              }
                              return delay;
                            },
                          },
                        }}
                        data={mockTransactionAnalyticsData2}
                      />
                    </div>
                  </Card>
                </Col>
                <Col md={12} xs={24}>
                  <Card className="dark:bg-zinc-800 text-card-foreground dark:text-white border dark:border-gray-500 shadow-md  hover:border-cyan-100">
                    <header className="flex flex-wrap gap-2 justify-between items-center">
                      <h3 className="font-semibold leading-none tracking-tight">
                        Comparative Transaction Summary
                      </h3>
                      <div>
                        <Space size={7}>
                          <Select
                            loading={false}
                            options={statisticsFilter}
                            defaultValue={statisticsFilter[0]}
                            placeholder="Select a filter"
                          />
                        </Space>
                      </div>
                    </header>
                    <div className="mt-5 flex items-center justify-center">
                      <Bar
                        redraw
                        className="w-full"
                        options={{
                          responsive: true,
                          scales: {
                            x: {
                              grid: {
                                display: false,
                              },
                            },
                            y: {
                              grid: {
                                display: false,
                              },
                            },
                          },
                          plugins: {
                            legend: {
                              position: 'bottom',
                              align: 'center',
                            },
                          },

                          animation: {
                            onComplete: () => {
                              delayed = true;
                            },
                            delay: (context: any) => {
                              let delay = 0;
                              if (
                                context.type === 'data' &&
                                context.mode === 'default' &&
                                !delayed
                              ) {
                                delay = context.dataIndex * 300 + context.datasetIndex * 100;
                              }
                              return delay;
                            },
                          },
                        }}
                        data={comparativeAnalysisData}
                      />
                    </div>
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </div>
        <CustomModal
          component={
            <CreateWalletForm
              isLoadingCreateWallet={loading.isCreatingWallet}
              handleCreateWallet={handleCreateWallet}
            />
          }
          setOpenModal={() => setOpenCreateModal(false)}
          openModal={openCreateModal}
        />
        <CustomModal
          component={<TopUpBalance wallet={wallet} />}
          setOpenModal={() => setToggleTopUp(false)}
          openModal={toggleTopUp}
        />

        <CustomModal
          component={<div>Single Payout</div>}
          setOpenModal={() => setToggleDisbursement(false)}
          openModal={toggleDisbursement}
        />
      </motion.div>
    </>
  );
};

export default DashBoard;
