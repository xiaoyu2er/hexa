'use client';

export function deleteCookie(sKey: string, sPath?: string, sDomain?: string) {
  document.cookie = `${encodeURIComponent(sKey)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT${sDomain ? `; domain=${sDomain}` : ''}${sPath ? `; path=${sPath}` : ''}`;
}
