<?php

class XenForo_DnsBl
{
	protected $_host;

	public function __construct($host)
	{
		$this->_host = $host;
	}

	public function checkIp($ip)
	{
		$parts = explode('.', trim($ip));
		if (count($parts) != 4)
		{
			return false;
		}

		$parts = array_map('intval', $parts);
		$parts = array_reverse($parts);

		$query = implode('.', $parts) . ".$this->_host";

		$result = gethostbyname($query);
		if (!$result)
		{
			return false;
		}

		if ($result === $query)
		{
			// not found
			return false;
		}

		$resultParts = explode('.', $result);
		if (count($resultParts) < 4)
		{
			return false;
		}

		if ($resultParts[0] == '127' && $resultParts[1] == '0' && $resultParts[2] == '0')
		{
			return intval($resultParts[3]);
		}
		else
		{
			return false;
		}
	}

	public static function checkSpamhaus($ip)
	{
		$dnsBl = new self('zen.spamhaus.org');
		$result = $dnsBl->checkIp($ip);

		// on the SBL or XBL
		return ($result && $result >= 2 && $result <= 7);
	}

	public static function checkTornevall($ip)
	{
		$dnsBl = new self('dnsbl.tornevall.org');
		$result = $dnsBl->checkIp($ip);

		// bitmask 64 is abusive
		return ($result && $result & 64);
	}
}