-- phpMyAdmin SQL Dump
-- version 4.5.3.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: 2018-12-01 17:13:21
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
(5, '2018-11-28', '无自检', 'self', 2),
(6, '2018-12-01', '自检', '', 1),
(7, '2018-12-01', '无自检', '', 1),
(8, '2018-12-01', '无自检', '', 2),
(9, '2018-12-12', '无自检', '', 2),
(10, '2018-12-01', '无自检', '', 1),
(11, '2018-11-27', '无自检', '', 2),
(12, '2018-12-01', '无自检', '', 2),
(13, '2018-12-01', '自检', '', 1),
(14, '2018-12-01', '自检', '', 1),
(15, '2018-12-01', '自检', '', 1),
(16, '2018-12-01', '自检', '', 1),
(17, '2018-12-01', '自检', '', 1),
(18, '2018-12-01', '自检', '', 1),
(19, '2018-12-01', '自检', '', 1),
(20, '2018-12-01', '无自检', '', 1),
(21, '2018-12-01', '自检', '', 1),
(22, '2018-12-01', '自检', '', 1),
(23, '2018-12-01', '无自检', '', 1),
(24, '2018-12-01', '自检', '', 1),
(25, '2018-12-01', '无自检', '', 1),
(26, '2018-12-01', '无自检', '', 1),
(27, '2018-12-01', '自检', '', 1),
(28, '2018-12-01', '自检', '', 1),
(29, '2018-12-01', '自检', '', 1),
(30, '2018-12-01', '无自检', '', 1),
(31, '2018-12-01', '自检', '', 1),
(32, '2018-12-01', '自检', '', 1),
(33, '2018-12-01', '自检', '', 1),
(34, '2018-12-01', '自检', '', 1),
(35, '2018-12-01', '自检', '', 1),
(36, '2018-12-01', '无自检', '', 1),
(37, '2018-12-01', '自检', '', 1),
(38, '2018-12-01', '自检', '', 1),
(39, '2018-12-01', '自检', '', 1),
(40, '2018-12-01', '自检', '', 1),
(41, '2018-12-01', '自检', '', 1),
(42, '2018-12-01', '自检', '', 1),
(43, '2018-12-01', '自检', '', 1),
(44, '2018-12-01', '自检', '', 1),
(45, '2018-12-01', '无自检', '', 1),
(46, '2018-12-01', '自检', '', 1),
(47, '2018-12-01', '无自检', '', 1),
(48, '2018-12-01', '自检', '', 1),
(49, '2018-12-01', '无自检', '', 1),
(50, '2018-12-01', '自检', '', 1),
(51, '2018-12-01', '自检', '', 1),
(52, '2018-12-01', '自检', '', 1),
(53, '2018-12-01', '自检', '', 1),
(54, '2018-12-01', '自检', '', 1);

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
(5, '2018-11-27 22:45:54', '单鉴', '正门门口', '已派警', 4),
(6, '2018-12-01 22:03:46', '单鉴', '大厅', '', 1),
(7, '2018-12-01 22:03:58', '单鉴', '大厅', '', 2),
(8, '2018-12-01 22:04:09', '单鉴', '大厅', '', 2),
(9, '2018-12-01 22:04:25', '双鉴', '正门门口', '', 3),
(10, '2018-12-01 22:04:35', '双鉴', '正门门口', '', 4),
(11, '2018-12-01 22:04:45', '双鉴', '大厅', '', 4),
(12, '2018-12-01 22:04:54', '双鉴', '大厅', '', 1),
(13, '2018-12-01 22:06:34', '单鉴', '大厅', '', 1),
(14, '2018-12-01 22:06:46', '单鉴', '大厅', '', 1),
(15, '2018-12-01 22:06:59', '双鉴', '大厅', '', 1),
(16, '2018-12-01 22:07:09', '单鉴', '大厅', '', 1),
(17, '2018-12-01 23:59:40', '单鉴', '大厅', '', 1),
(18, '2018-12-01 23:59:50', '单鉴', '大厅', '', 1),
(19, '2018-12-02 00:00:00', '单鉴', '大厅', '', 1),
(20, '2018-12-02 00:00:07', '单鉴', '大厅', '', 1),
(21, '2018-12-02 00:00:15', '单鉴', '正门门口', '', 1),
(22, '2018-12-02 00:00:22', '单鉴', '大厅', '', 1),
(23, '2018-12-02 00:00:30', '双鉴', '正门门口', '', 1),
(24, '2018-12-02 00:00:37', '双鉴', '大厅', '', 1),
(25, '2018-12-02 00:00:45', '双鉴', '正门门口', '', 1),
(26, '2018-12-02 00:00:52', '双鉴', '正门门口', '', 1),
(27, '2018-12-02 00:01:00', '双鉴', '正门门口', '', 1),
(28, '2018-12-02 00:01:08', '单鉴', '大厅', '', 1),
(29, '2018-12-02 00:01:16', '单鉴', '大厅', '', 1),
(30, '2018-12-02 00:01:23', '单鉴', '正门门口', '', 1),
(31, '2018-12-02 00:01:32', '双鉴', '正门门口', '', 1),
(32, '2018-12-02 00:01:42', '单鉴', '大厅', '', 1),
(33, '2018-12-02 00:01:50', '单鉴', '大厅', '', 1),
(34, '2018-12-02 00:01:58', '单鉴', '正门门口', '', 1),
(35, '2018-12-02 00:02:07', '单鉴', '大厅', '', 1),
(36, '2018-12-02 00:02:15', '单鉴', '大厅', '', 1),
(37, '2018-12-02 00:02:23', '双鉴', '正门门口', '', 1),
(38, '2018-12-02 00:02:30', '单鉴', '正门门口', '', 1);

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
(1, '2018-11-27', '柜台按钮误报', '更换线路', '4*0.3线缆30m', '李冉', 1),
(4, '2018-12-01', '柜台按钮误报', '更换线路', '4*0.3线缆30m', '其他', 1),
(5, '2018-12-01', '柜台按钮误报', '更换线路', '4*0.3线缆30m', '李冉', 1),
(6, '2018-12-01', '柜台按钮误报', '其他', '4*0.3线缆30m', '其他', 1),
(7, '2018-12-01', '柜台按钮误报', '更换线路', '4*0.3线缆30m', '李冉', 1),
(8, '2018-12-01', '柜台按钮误报', '更换线路', '4*0.3线缆30m', '李冉', 1),
(9, '2018-12-01', '柜台按钮误报', '更换线路', '4*0.3线缆30m', '李冉', 1),
(10, '2018-12-01', '柜台按钮误报', '更换线路', '4*0.3线缆30m', '李冉', 1),
(11, '2018-12-01', '柜台按钮误报', '更换线路', '4*0.3线缆30m', '李冉', 1),
(12, '2018-12-01', '其他', '其他', '其他', '其他', 1),
(13, '2018-12-01', '其他', '其他', '其他', '其他', 1),
(14, '2018-12-02', '柜台按钮误报', '更换线路', '4*0.3线缆30m', '李冉', 1);

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
(4, '2018-11-28 20:12:54', '自动测试', '1', '大厅', 10, '18222333456', 1),
(5, '2018-12-01 22:09:35', '手动测试', '1', '大厅', 1, '11', 1),
(6, '2018-12-02 00:11:13', '手动测试', '1', '大厅', 1, '111', 1);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;
--
-- 使用表AUTO_INCREMENT `event`
--
ALTER TABLE `event`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;
--
-- 使用表AUTO_INCREMENT `repair`
--
ALTER TABLE `repair`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
--
-- 使用表AUTO_INCREMENT `test`
--
ALTER TABLE `test`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- 使用表AUTO_INCREMENT `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
