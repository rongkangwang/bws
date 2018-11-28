-- phpMyAdmin SQL Dump
-- version 4.5.3.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: 2018-11-28 14:31:40
-- 服务器版本： 10.1.19-MariaDB
-- PHP Version: 5.6.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bws`
--

-- --------------------------------------------------------

--
-- 表的结构 `deviceselfcheck`
--

CREATE TABLE `deviceselfcheck` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `status` varchar(20) NOT NULL,
  `solution` varchar(100) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `deviceselfcheck`
--

INSERT INTO `deviceselfcheck` (`id`, `date`, `status`, `solution`, `user_id`) VALUES
(1, '2018-11-27', '无自检', '', 1),
(3, '2018-11-01', '自检', '', 2),
(4, '2018-11-24', '无自检', 'ccc', 2),
(5, '2018-11-28', '无自检', 'self', 2);

-- --------------------------------------------------------

--
-- 表的结构 `event`
--

CREATE TABLE `event` (
  `id` int(11) NOT NULL,
  `datetime` datetime NOT NULL,
  `detector_type` varchar(20) NOT NULL,
  `position` varchar(20) NOT NULL,
  `solution` varchar(100) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `event`
--

INSERT INTO `event` (`id`, `datetime`, `detector_type`, `position`, `solution`, `user_id`) VALUES
(1, '2018-11-27 14:25:36', '双鉴', '大厅', '', 1),
(3, '2018-11-27 22:37:23', '双鉴', '正门门口', '', 1),
(5, '2018-11-27 22:45:54', '单鉴', '正门门口', '已派警', 4);

-- --------------------------------------------------------

--
-- 表的结构 `repair`
--

CREATE TABLE `repair` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `status` varchar(20) NOT NULL,
  `content` varchar(20) NOT NULL,
  `material` varchar(20) NOT NULL,
  `staff` varchar(20) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `repair`
--

INSERT INTO `repair` (`id`, `date`, `status`, `content`, `material`, `staff`, `user_id`) VALUES
(1, '2018-11-27', '柜台按钮误报', '更换线路', '4*0.3线缆30m', '李冉', 1);

-- --------------------------------------------------------

--
-- 表的结构 `test`
--

CREATE TABLE `test` (
  `id` int(11) NOT NULL,
  `datetime` datetime NOT NULL,
  `test_type` varchar(20) NOT NULL,
  `sector` varchar(20) NOT NULL,
  `position` varchar(20) NOT NULL,
  `report_num` int(11) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `test`
--

INSERT INTO `test` (`id`, `datetime`, `test_type`, `sector`, `position`, `report_num`, `phone_number`, `user_id`) VALUES
(2, '2018-11-21 23:56:38', '自动测试', '2', '正门门口', 1, '9871234567', 1),
(3, '2018-11-27 23:58:43', '自动测试', '2', '大厅', 8, '9731234567', 2),
(4, '2018-11-28 20:12:54', '自动测试', '1', '大厅', 10, '18222333456', 1);

-- --------------------------------------------------------

--
-- 表的结构 `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `address` varchar(100) NOT NULL,
  `device_id` varchar(20) NOT NULL,
  `device_phone` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `user`
--

INSERT INTO `user` (`id`, `username`, `address`, `device_id`, `device_phone`) VALUES
(1, '中国银行天津分行南开支行', '未知', '100111111', '022-26526255'),
(2, '交通银行天津分行南开大学支行', '卫津路94号', '10023', ''),
(3, '农业银行天津分行南开支行', '', '10034', ''),
(4, '工商银行天津分行南开大学支行', '', 'r112', '02222222');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `deviceselfcheck`
--
ALTER TABLE `deviceselfcheck`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `event`
--
ALTER TABLE `event`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `repair`
--
ALTER TABLE `repair`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `test`
--
ALTER TABLE `test`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `deviceselfcheck`
--
ALTER TABLE `deviceselfcheck`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- 使用表AUTO_INCREMENT `event`
--
ALTER TABLE `event`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- 使用表AUTO_INCREMENT `repair`
--
ALTER TABLE `repair`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- 使用表AUTO_INCREMENT `test`
--
ALTER TABLE `test`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- 使用表AUTO_INCREMENT `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
