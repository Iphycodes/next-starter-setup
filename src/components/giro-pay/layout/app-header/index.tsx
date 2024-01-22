'use client';
import React, { ReactElement, useCallback } from 'react';
import { Layout, Space, Switch, Avatar, Popover } from 'antd';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { CaretDownOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { RiMoonFill } from 'react-icons/ri';
import { HiOutlineLightBulb } from 'react-icons/hi';
import { useContext } from 'react';
import { AppContext } from '@grc/app-context';
import { useRouter } from 'next/navigation';
import { getFirstCharacter, getRandomColorByString } from '@grc/_shared/helpers';
import * as _ from 'lodash';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { PasswordIcon } from '@grc/_shared/assets/svgs';
import { useTheme } from 'next-themes';

const { Header } = Layout;

export interface AppHeaderProps {
  items?: ReactElement[];
}

export const AppHeader = (props: AppHeaderProps) => {
  const {} = props;
  const isMobile = useMediaQuery(mediaSize.mobile);
  const pathname = usePathname();
  const pathUrl = pathname?.split('/');
  const currentPath = `${pathUrl?.[3]}`?.toUpperCase() ?? '';
  const isAppSettingsPath = pathUrl?.[2]?.toLowerCase() === 'settings';
  const { authData } = useContext(AppContext);
  const router = useRouter();
  const { handleLogOut } = useContext(AppContext);
  const { setTheme, theme } = useTheme();

  const handleMenuClick = (key: string) => {
    if (key === 'logout') {
      handleLogOut();
      router.push('/auth/login');
    } else if (key === 'my-profile') {
      router.push('/apps/settings/profile-details');
    } else if (key === 'change-password') {
      router.push('/apps/settings/change-password');
    }
  };

  const getContent = useCallback(() => {
    return (
      <div>
        {!isAppSettingsPath && (
          <>
            <div
              className="cursor-pointer rounded-sm px-3 py-1 hover:bg-gray-100"
              onClick={() => handleMenuClick('my-profile')}
            >
              <Space className="p-1" size={15}>
                <UserOutlined />
                <span>My Profile</span>
              </Space>
            </div>

            <div
              className="cursor-pointer rounded-sm px-3 py-1 hover:bg-gray-100"
              onClick={() => handleMenuClick('change-password')}
            >
              <Space className="p-1" size={15}>
                <PasswordIcon />
                <span>Change Password</span>
              </Space>
            </div>
          </>
        )}

        <div
          className="cursor-pointer rounded-sm px-3 py-1 hover:bg-gray-100"
          onClick={() => handleMenuClick('logout')}
        >
          <Space className="p-1" size={15}>
            <LogoutOutlined />
            <span>Logout</span>
          </Space>
        </div>
      </div>
    );
  }, []);

  return (
    <Header
      className="layout-header shadow-sm border-b border-border/100 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:text-white"
      style={{
        position: 'sticky',
        top: 0,
        height: 'auto',
        display: 'flex',
        alignItems: 'center',
        padding: `${isMobile ? '10px' : '0 40px'}`,
        zIndex: 100,
      }}
    >
      <div className="flex justify-between items-center min-w-full dark:text-white">
        {(pathUrl ?? [])?.length <= 2 ? (
          <span className=" cursor-pointer" onClick={() => router.push('/apps')}>
            <Image src={'/assets/svgs/giro-logo.svg'} alt="giro-logo" width={120} height={50} />
          </span>
        ) : isAppSettingsPath ? (
          <div className="font-bold text-3">
            <span
              className=" text-muted-foreground mr-8 cursor-pointer"
              onClick={() => router.back()}
            >
              &larr; Back
            </span>{' '}
            <span className="">Settings </span>
          </div>
        ) : (
          <span className="font-bold text-3">{`${currentPath}`}</span>
        )}
        <div className="flex items-center gap-10">
          {!isAppSettingsPath && (
            <>
              {' '}
              <div className="flex gap-2 items-center">
                <Switch className="live-mode-switch" size="small" />
                <span className="font-bold">Live mode</span>
              </div>
              <Link className="underline" href={'/'}>
                API Documentation
              </Link>
              <Link className="underline" href={'/'}>
                For Developers
              </Link>
            </>
          )}

          <span className="cursor-pointer">
            {theme === 'light' ? (
              <HiOutlineLightBulb size={20} onClick={() => setTheme('dark')} />
            ) : (
              <RiMoonFill size={20} onClick={() => setTheme('light')} />
            )}
          </span>

          <Popover
            content={getContent()}
            placement={'bottomLeft'}
            overlayClassName="dropdown-popover"
            trigger={'click'}
            showArrow={false}
            arrow={false}
            overlayStyle={{ zIndex: 500, marginTop: '510px' }}
          >
            <div className="cursor-pointer flex items-center gap-2">
              <Avatar
                style={{
                  backgroundColor: getRandomColorByString(authData?.firstName ?? ''),
                  verticalAlign: 'middle',
                }}
              >
                {_.isEmpty('') && getFirstCharacter(authData?.firstName ?? '')}
              </Avatar>
              <span className="font-bold">{authData?.firstName}</span>
              <CaretDownOutlined size={10} />
            </div>
          </Popover>
        </div>
      </div>
    </Header>
  );
};