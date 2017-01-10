<?php
/**
 * @package     JCE
 * @copyright   Copyright (C) 2006 - 2012 Ryan Demmer. All rights reserved
 * @author		Ryan Demmer
 * @license		http://www.gnu.org/licenses/gpl-2.0.html GNU/GPLv2 only
 *
 * JCE is free software. This version may have been modified pursuant
 * to the GNU General Public License, and as distributed it includes or
 * is derivative of works licensed under the GNU General Public License or
 * other free or open source software licenses.
 */
class WFJbtypePluginConfig
{
	public function getConfig(&$settings)
	{
		$plugin	= JPluginHelper::getPlugin('system','jbtype');

		if ($plugin) {
			$param = null;
			
			if (version_compare(JVERSION, '1.6', '>=')) {
				$param = new JRegistry;
				$param->loadString($plugin->params);
			} else {
				$param = new JParameter($plugin->params);
			}

			$settings['jbtype_icons'] = $param->get('iconStyle', 'coquette');
		} else {
			$settings['plugins'] = array_diff($settings['plugins'], array('jptype'));
		}
	}
}
?>
