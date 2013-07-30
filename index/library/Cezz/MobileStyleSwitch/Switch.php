<?php

class Cezz_MobileStyleSwitch_Switch
{

	public static $knownMobiles = array();

	public static function setStyleId(&$visitor)
	{
		$additionalAgents = XenForo_Application::get('options')->MobileStyleSwitchAgents;
		if(!empty($additionalAgents) && preg_match("/[a-z0-9\s,]*/i", $additionalAgents)) {
			foreach (explode(',',$additionalAgents) as $agent){
				self::$knownMobiles[] = $agent;
			}
		}

		$style_id = XenForo_Application::get('options')->MobileStyleSwitchId;
		if (!empty($_SERVER['HTTP_USER_AGENT']))
		{
			if (self::isMobile($_SERVER['HTTP_USER_AGENT'])) 
				return $visitor['style_id'] = $style_id;
		}
	}

	public static function isMobile($userAgent)
	{
		if (preg_match('#(' . implode('|', array_map('preg_quote', self::$knownMobiles)) . ')#i', strtolower($userAgent), $match))
		{
			return $match[1];
		}

		return false;
	}
}
