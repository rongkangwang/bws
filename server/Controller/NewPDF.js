const PDFDocument = require('pdfkit')
const fs = require('fs')
const path = require('path');
const mysql = require('mysql');
const moment = require('moment')
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'bws'
});
connection.connect();

exports.generatepdf = function(req, res) {
    const {user_id, date} = req.query;
    let filename = "";
    const doc = new PDFDocument();
    const stream = doc.pipe(fs.createWriteStream(path.join(__dirname,'..','file','Aim.pdf')));

    const page_width = doc.page.width;
    const page_height = doc.page.height;
    const line_height = 20;
    const line_start_x = 30;
    const line_start_y = 140
    const table_width = page_width-line_start_x*2;
    const font_height_start = 4;
    const font_width_start = 1;
    const font_size = 12;

    let current_page_num = 0;
    let current_line_num = 0;
    let current_height = 0;
    let first_page_limit = 29;
    let other_page_limit = 32;
    let new_page_start_y = 70;


    connection.query("select * from user where id="+user_id,function (error, results) {
        if (error) {
            console.log(error);
            res.send(error);
        } else {
            filename = results[0]["device_id"]+" "+date+".pdf";
            doc.font("fonts/songti.ttf").fontSize(20).text(results[0]["username"]+"报警信息月统计表", {align:"center"});
            doc.moveDown();
            doc.font("fonts/songti.ttf").fontSize(10).text("统计月份："+date, {align:"right"});
            doc.rect(line_start_x,line_start_y,table_width,line_height).stroke();
            doc.rect(line_start_x,line_start_y+line_height,table_width,line_height).stroke();
            doc.moveTo(line_start_x+table_width*0.15,line_start_y).lineTo(line_start_x+table_width*0.15, line_start_y+line_height*2).stroke();
            doc.moveTo(line_start_x+table_width*0.65,line_start_y).lineTo(line_start_x+table_width*0.65, line_start_y+line_height*2).stroke();
            doc.moveTo(line_start_x+table_width*0.8,line_start_y).lineTo(line_start_x+table_width*0.8, line_start_y+line_height*2).stroke();
            doc.font("fonts/songti.ttf").fontSize(font_size).text("用户名称：", line_start_x+font_width_start, line_start_y+font_height_start);
            doc.font("fonts/songti.ttf").fontSize(font_size).text("用户地址：", line_start_x+font_width_start, line_start_y+font_height_start+line_height);
            doc.font("fonts/songti.ttf").fontSize(font_size).text("设备机器号：", line_start_x+table_width*0.65+font_width_start, line_start_y+font_height_start);
            doc.font("fonts/songti.ttf").fontSize(font_size).text("设备电话：", line_start_x+table_width*0.65+font_width_start, line_start_y+font_height_start+line_height);
            doc.font("fonts/songti.ttf").fontSize(font_size).text(results[0]["username"], line_start_x+table_width*0.15+font_width_start, line_start_y+font_height_start);
            doc.font("fonts/songti.ttf").fontSize(font_size).text(results[0]["address"], line_start_x+table_width*0.15+font_width_start, line_start_y+font_height_start+line_height);
            doc.font("fonts/songti.ttf").fontSize(font_size).text(results[0]["device_id"], line_start_x+table_width*0.8+font_width_start, line_start_y+font_height_start, {width:table_width*0.2});
            doc.font("fonts/songti.ttf").fontSize(font_size).text(results[0]["device_phone"], line_start_x+table_width*0.8+font_width_start, line_start_y+font_height_start+line_height, {width:table_width*0.2});
            doc.rect(line_start_x,line_start_y+line_height*2,table_width,line_height).stroke();
            doc.font("fonts/songtibold.ttf").fontSize(11).text("报警事件详情", line_start_x+font_width_start, line_start_y+font_height_start+line_height*2);
            current_line_num = 3;
            current_height = line_start_y+line_height*3;
            //event details
            const start_datetime = date+"-01 00:00:00";
            const end_datetime = getNextMonth(date)+"-01 00:00:00";
            connection.query("select * from event where datetime>='"+start_datetime+"' and datetime<'"+end_datetime+"' and user_id="+user_id, function (error, results) {
                if(error){
                    console.log(error);
                    res.send(error);
                } else{
                    let line_num = 0;
                    if(current_page_num === 0&&current_line_num>=first_page_limit){
                        doc.addPage();
                        current_page_num++;
                        current_height = new_page_start_y;
                        current_line_num = 0;
                        doc.rect(line_start_x,current_height,table_width,line_height).stroke();
                        doc.moveTo(line_start_x+table_width*0.15,current_height).lineTo(line_start_x+table_width*0.15, current_height+line_height).stroke();
                        doc.moveTo(line_start_x+table_width*0.25,current_height).lineTo(line_start_x+table_width*0.25,current_height+line_height).stroke();
                        doc.moveTo(line_start_x+table_width*0.4,current_height).lineTo(line_start_x+table_width*0.4, current_height+line_height).stroke();
                        doc.moveTo(line_start_x+table_width*0.5,current_height).lineTo(line_start_x+table_width*0.5, current_height+line_height).stroke();
                        doc.font("fonts/songti.ttf").fontSize(font_size).text("日期", line_start_x, current_height+font_height_start, {width:table_width*0.15, align:"center"});
                        doc.font("fonts/songti.ttf").fontSize(font_size).text("时间", line_start_x+table_width*0.15, current_height+font_height_start, {width:table_width*0.1, align:"center"});
                        doc.font("fonts/songti.ttf").fontSize(font_size).text("探测器类型", line_start_x+table_width*0.25, current_height+font_height_start, {width:table_width*0.15, align:"center"});
                        doc.font("fonts/songti.ttf").fontSize(font_size).text("防区位置", line_start_x+table_width*0.4, current_height+font_height_start, {width:table_width*0.1, align:"center"});
                        doc.font("fonts/songti.ttf").fontSize(font_size).text("处理办法", line_start_x+table_width*0.5, current_height+font_height_start, {width:table_width*0.5, align:"center"});
                        current_height = current_height+line_height;
                        current_line_num++;
                    }else if(current_page_num > 0&&current_line_num >= other_page_limit){
                        doc.addPage();
                        current_page_num++;
                        current_height = new_page_start_y;
                        current_line_num = 0;
                        doc.rect(line_start_x,current_height,table_width,line_height).stroke();
                        doc.moveTo(line_start_x+table_width*0.15,current_height).lineTo(line_start_x+table_width*0.15, current_height+line_height).stroke();
                        doc.moveTo(line_start_x+table_width*0.25,current_height).lineTo(line_start_x+table_width*0.25,current_height+line_height).stroke();
                        doc.moveTo(line_start_x+table_width*0.4,current_height).lineTo(line_start_x+table_width*0.4, current_height+line_height).stroke();
                        doc.moveTo(line_start_x+table_width*0.5,current_height).lineTo(line_start_x+table_width*0.5, current_height+line_height).stroke();
                        doc.font("fonts/songti.ttf").fontSize(font_size).text("日期", line_start_x, current_height+font_height_start, {width:table_width*0.15, align:"center"});
                        doc.font("fonts/songti.ttf").fontSize(font_size).text("时间", line_start_x+table_width*0.15, current_height+font_height_start, {width:table_width*0.1, align:"center"});
                        doc.font("fonts/songti.ttf").fontSize(font_size).text("探测器类型", line_start_x+table_width*0.25, current_height+font_height_start, {width:table_width*0.15, align:"center"});
                        doc.font("fonts/songti.ttf").fontSize(font_size).text("防区位置", line_start_x+table_width*0.4, current_height+font_height_start, {width:table_width*0.1, align:"center"});
                        doc.font("fonts/songti.ttf").fontSize(font_size).text("处理办法", line_start_x+table_width*0.5, current_height+font_height_start, {width:table_width*0.5, align:"center"});
                        current_height = current_height+line_height;
                        current_line_num++;
                    }else{
                        doc.rect(line_start_x,current_height,table_width,line_height).stroke();
                        doc.moveTo(line_start_x+table_width*0.15,current_height).lineTo(line_start_x+table_width*0.15, current_height+line_height).stroke();
                        doc.moveTo(line_start_x+table_width*0.25,current_height).lineTo(line_start_x+table_width*0.25,current_height+line_height).stroke();
                        doc.moveTo(line_start_x+table_width*0.4,current_height).lineTo(line_start_x+table_width*0.4, current_height+line_height).stroke();
                        doc.moveTo(line_start_x+table_width*0.5,current_height).lineTo(line_start_x+table_width*0.5, current_height+line_height).stroke();
                        doc.font("fonts/songti.ttf").fontSize(font_size).text("日期", line_start_x, current_height+font_height_start, {width:table_width*0.15, align:"center"});
                        doc.font("fonts/songti.ttf").fontSize(font_size).text("时间", line_start_x+table_width*0.15, current_height+font_height_start, {width:table_width*0.1, align:"center"});
                        doc.font("fonts/songti.ttf").fontSize(font_size).text("探测器类型", line_start_x+table_width*0.25, current_height+font_height_start, {width:table_width*0.15, align:"center"});
                        doc.font("fonts/songti.ttf").fontSize(font_size).text("防区位置", line_start_x+table_width*0.4, current_height+font_height_start, {width:table_width*0.1, align:"center"});
                        doc.font("fonts/songti.ttf").fontSize(font_size).text("处理办法", line_start_x+table_width*0.5, current_height+font_height_start, {width:table_width*0.5, align:"center"});
                        current_height = current_height+line_height;
                        current_line_num++;
                    }
                    if(results.length==0){
                        line_num = 1;
                        for(let i=0;i<line_num;i++){
                            if(current_page_num === 0&&current_line_num>=first_page_limit){
                                doc.addPage();
                                current_page_num++;
                                current_height = new_page_start_y;
                                current_line_num = 0;
                                doc.rect(line_start_x,current_height,table_width,line_height).stroke();
                                doc.moveTo(line_start_x+table_width*0.15,current_height).lineTo(line_start_x+table_width*0.15, current_height+line_height).stroke();
                                doc.moveTo(line_start_x+table_width*0.25,current_height).lineTo(line_start_x+table_width*0.25,current_height+line_height).stroke();
                                doc.moveTo(line_start_x+table_width*0.4,current_height).lineTo(line_start_x+table_width*0.4, current_height+line_height).stroke();
                                doc.moveTo(line_start_x+table_width*0.5,current_height).lineTo(line_start_x+table_width*0.5, current_height+line_height).stroke();
                                current_height = current_height+line_height;
                                current_line_num++;
                            }else if(current_page_num > 0&&current_line_num >= other_page_limit){
                                doc.addPage();
                                current_page_num++;
                                current_height = new_page_start_y;
                                current_line_num = 0;
                                doc.rect(line_start_x,current_height,table_width,line_height).stroke();
                                doc.moveTo(line_start_x+table_width*0.15,current_height).lineTo(line_start_x+table_width*0.15, current_height+line_height).stroke();
                                doc.moveTo(line_start_x+table_width*0.25,current_height).lineTo(line_start_x+table_width*0.25,current_height+line_height).stroke();
                                doc.moveTo(line_start_x+table_width*0.4,current_height).lineTo(line_start_x+table_width*0.4, current_height+line_height).stroke();
                                doc.moveTo(line_start_x+table_width*0.5,current_height).lineTo(line_start_x+table_width*0.5, current_height+line_height).stroke();
                                current_height = current_height+line_height;
                                current_line_num++;
                            }else{
                                doc.rect(line_start_x,current_height,table_width,line_height).stroke();
                                doc.moveTo(line_start_x+table_width*0.15,current_height).lineTo(line_start_x+table_width*0.15, current_height+line_height).stroke();
                                doc.moveTo(line_start_x+table_width*0.25,current_height).lineTo(line_start_x+table_width*0.25,current_height+line_height).stroke();
                                doc.moveTo(line_start_x+table_width*0.4,current_height).lineTo(line_start_x+table_width*0.4, current_height+line_height).stroke();
                                doc.moveTo(line_start_x+table_width*0.5,current_height).lineTo(line_start_x+table_width*0.5, current_height+line_height).stroke();
                                current_height = current_height+line_height;
                                current_line_num++;
                            }
                        }
                    } else {
                        line_num = results.length;
                        for(let i=0;i<line_num;i++){
                            if(current_page_num === 0&&current_line_num>=first_page_limit){
                                doc.addPage();
                                current_page_num++;
                                current_height = new_page_start_y;
                                current_line_num = 0;
                                doc.rect(line_start_x,current_height,table_width,line_height).stroke();
                                doc.moveTo(line_start_x+table_width*0.15,current_height).lineTo(line_start_x+table_width*0.15, current_height+line_height).stroke();
                                doc.moveTo(line_start_x+table_width*0.25,current_height).lineTo(line_start_x+table_width*0.25,current_height+line_height).stroke();
                                doc.moveTo(line_start_x+table_width*0.4,current_height).lineTo(line_start_x+table_width*0.4, current_height+line_height).stroke();
                                doc.moveTo(line_start_x+table_width*0.5,current_height).lineTo(line_start_x+table_width*0.5, current_height+line_height).stroke();
                                doc.font("fonts/songti.ttf").fontSize(font_size).text(moment(results[i]["datetime"]).format("YYYY.MM.DD"), line_start_x, current_height+font_height_start, {width:table_width*0.15, align:"center"});
                                doc.font("fonts/songti.ttf").fontSize(font_size).text(moment(results[i]["datetime"]).format("HH:mm"), line_start_x+table_width*0.15, current_height+font_height_start, {width:table_width*0.1, align:"center"});
                                doc.font("fonts/songti.ttf").fontSize(font_size).text(results[i]["detector_type"], line_start_x+table_width*0.25, current_height+font_height_start, {width:table_width*0.15, align:"center"});
                                doc.font("fonts/songti.ttf").fontSize(font_size).text(results[i]["position"], line_start_x+table_width*0.4, current_height+font_height_start, {width:table_width*0.1, align:"center"});
                                doc.font("fonts/songti.ttf").fontSize(font_size).text(results[i]["solution"], line_start_x+table_width*0.5, current_height+font_height_start, {width:table_width*0.5, align:"center"});
                                current_height = current_height+line_height;
                                current_line_num++;
                            }else if(current_page_num > 0&&current_line_num >= other_page_limit){
                                doc.addPage();
                                current_page_num++;
                                current_height = new_page_start_y;
                                current_line_num = 0;
                                doc.rect(line_start_x,current_height,table_width,line_height).stroke();
                                doc.moveTo(line_start_x+table_width*0.15,current_height).lineTo(line_start_x+table_width*0.15, current_height+line_height).stroke();
                                doc.moveTo(line_start_x+table_width*0.25,current_height).lineTo(line_start_x+table_width*0.25,current_height+line_height).stroke();
                                doc.moveTo(line_start_x+table_width*0.4,current_height).lineTo(line_start_x+table_width*0.4, current_height+line_height).stroke();
                                doc.moveTo(line_start_x+table_width*0.5,current_height).lineTo(line_start_x+table_width*0.5, current_height+line_height).stroke();
                                doc.font("fonts/songti.ttf").fontSize(font_size).text(moment(results[i]["datetime"]).format("YYYY.MM.DD"), line_start_x, current_height+font_height_start, {width:table_width*0.15, align:"center"});
                                doc.font("fonts/songti.ttf").fontSize(font_size).text(moment(results[i]["datetime"]).format("HH:mm"), line_start_x+table_width*0.15, current_height+font_height_start, {width:table_width*0.1, align:"center"});
                                doc.font("fonts/songti.ttf").fontSize(font_size).text(results[i]["detector_type"], line_start_x+table_width*0.25, current_height+font_height_start, {width:table_width*0.15, align:"center"});
                                doc.font("fonts/songti.ttf").fontSize(font_size).text(results[i]["position"], line_start_x+table_width*0.4, current_height+font_height_start, {width:table_width*0.1, align:"center"});
                                doc.font("fonts/songti.ttf").fontSize(font_size).text(results[i]["solution"], line_start_x+table_width*0.5, current_height+font_height_start, {width:table_width*0.5, align:"center"});
                                current_height = current_height+line_height;
                                current_line_num++;
                            }else{
                                doc.rect(line_start_x,current_height,table_width,line_height).stroke();
                                doc.moveTo(line_start_x+table_width*0.15,current_height).lineTo(line_start_x+table_width*0.15, current_height+line_height).stroke();
                                doc.moveTo(line_start_x+table_width*0.25,current_height).lineTo(line_start_x+table_width*0.25,current_height+line_height).stroke();
                                doc.moveTo(line_start_x+table_width*0.4,current_height).lineTo(line_start_x+table_width*0.4, current_height+line_height).stroke();
                                doc.moveTo(line_start_x+table_width*0.5,current_height).lineTo(line_start_x+table_width*0.5, current_height+line_height).stroke();
                                doc.font("fonts/songti.ttf").fontSize(font_size).text(moment(results[i]["datetime"]).format("YYYY.MM.DD"), line_start_x, current_height+font_height_start, {width:table_width*0.15, align:"center"});
                                doc.font("fonts/songti.ttf").fontSize(font_size).text(moment(results[i]["datetime"]).format("HH:mm"), line_start_x+table_width*0.15, current_height+font_height_start, {width:table_width*0.1, align:"center"});
                                doc.font("fonts/songti.ttf").fontSize(font_size).text(results[i]["detector_type"], line_start_x+table_width*0.25, current_height+font_height_start, {width:table_width*0.15, align:"center"});
                                doc.font("fonts/songti.ttf").fontSize(font_size).text(results[i]["position"], line_start_x+table_width*0.4, current_height+font_height_start, {width:table_width*0.1, align:"center"});
                                doc.font("fonts/songti.ttf").fontSize(font_size).text(results[i]["solution"], line_start_x+table_width*0.5, current_height+font_height_start, {width:table_width*0.5, align:"center"});
                                current_height = current_height+line_height;
                                current_line_num++;
                            }
                        }
                    }
                    if(current_page_num === 0&&current_line_num>=first_page_limit){
                        doc.addPage();
                        current_page_num++;
                        current_height = new_page_start_y;
                        current_line_num = 0;
                        doc.rect(line_start_x,current_height,table_width,line_height).stroke();
                        doc.font("fonts/songtibold.ttf").fontSize(11).text("报警设备自检异常情况", line_start_x+font_width_start, current_height+font_height_start);
                        current_height = current_height+line_height;
                        current_line_num++;
                    }else if(current_page_num > 0&&current_line_num >= other_page_limit){
                        doc.addPage();
                        current_page_num++;
                        current_height = new_page_start_y;
                        current_line_num = 0;
                        doc.rect(line_start_x,current_height,table_width,line_height).stroke();
                        doc.font("fonts/songtibold.ttf").fontSize(11).text("报警设备自检异常情况", line_start_x+font_width_start, current_height+font_height_start);
                        current_height = current_height+line_height;
                        current_line_num++;
                    }else{
                        doc.rect(line_start_x,current_height,table_width,line_height).stroke();
                        doc.font("fonts/songtibold.ttf").fontSize(11).text("报警设备自检异常情况", line_start_x+font_width_start, current_height+font_height_start);
                        current_height = current_height+line_height;
                        current_line_num++;
                    }
                    connection.query("select * from deviceselfcheck where date>='"+start_datetime+"' and date<'"+end_datetime+"' and user_id="+user_id, function (error, results) {
                        if(error){
                            console.log(error);
                            res.send(error);
                        } else{
                            let line_num = 0;
                            if(current_page_num === 0&&current_line_num>=first_page_limit){
                                doc.addPage();
                                current_page_num++;
                                current_height = new_page_start_y;
                                current_line_num = 0;
                                doc.rect(line_start_x,current_height,table_width,line_height).stroke();
                                doc.moveTo(line_start_x+table_width*0.15,current_height).lineTo(line_start_x+table_width*0.15, current_height+line_height).stroke();
                                doc.moveTo(line_start_x+table_width*0.35,current_height).lineTo(line_start_x+table_width*0.35, current_height+line_height).stroke();
                                doc.font("fonts/songti.ttf").fontSize(font_size).text("日期", line_start_x, current_height+font_height_start, {width:table_width*0.15, align:"center"});
                                doc.font("fonts/songti.ttf").fontSize(font_size).text("故障概况", line_start_x+table_width*0.15, current_height+font_height_start, {width:table_width*0.2, align:"center"});
                                doc.font("fonts/songti.ttf").fontSize(font_size).text("处理办法", line_start_x+table_width*0.35, current_height+font_height_start, {width:table_width*0.65, align:"center"});
                                current_height = current_height+line_height;
                                current_line_num++;
                            }else if(current_page_num > 0&&current_line_num >= other_page_limit){
                                doc.addPage();
                                current_page_num++;
                                current_height = new_page_start_y;
                                current_line_num = 0;
                                doc.rect(line_start_x,current_height,table_width,line_height).stroke();
                                doc.moveTo(line_start_x+table_width*0.15,current_height).lineTo(line_start_x+table_width*0.15, current_height+line_height).stroke();
                                doc.moveTo(line_start_x+table_width*0.35,current_height).lineTo(line_start_x+table_width*0.35, current_height+line_height).stroke();
                                doc.font("fonts/songti.ttf").fontSize(font_size).text("日期", line_start_x, current_height+font_height_start, {width:table_width*0.15, align:"center"});
                                doc.font("fonts/songti.ttf").fontSize(font_size).text("故障概况", line_start_x+table_width*0.15, current_height+font_height_start, {width:table_width*0.2, align:"center"});
                                doc.font("fonts/songti.ttf").fontSize(font_size).text("处理办法", line_start_x+table_width*0.35, current_height+font_height_start, {width:table_width*0.65, align:"center"});
                                current_height = current_height+line_height;
                                current_line_num++;
                            }else{
                                doc.rect(line_start_x,current_height,table_width,line_height).stroke();
                                doc.moveTo(line_start_x+table_width*0.15,current_height).lineTo(line_start_x+table_width*0.15, current_height+line_height).stroke();
                                doc.moveTo(line_start_x+table_width*0.35,current_height).lineTo(line_start_x+table_width*0.35, current_height+line_height).stroke();
                                doc.font("fonts/songti.ttf").fontSize(font_size).text("日期", line_start_x, current_height+font_height_start, {width:table_width*0.15, align:"center"});
                                doc.font("fonts/songti.ttf").fontSize(font_size).text("故障概况", line_start_x+table_width*0.15, current_height+font_height_start, {width:table_width*0.2, align:"center"});
                                doc.font("fonts/songti.ttf").fontSize(font_size).text("处理办法", line_start_x+table_width*0.35, current_height+font_height_start, {width:table_width*0.65, align:"center"});
                                current_height = current_height+line_height;
                                current_line_num++;
                            }
                            if(results.length==0){
                                line_num = 1;
                                for(let i=0;i<line_num;i++){
                                    if(current_page_num === 0&&current_line_num>=first_page_limit){
                                        doc.addPage();
                                        current_page_num++;
                                        current_height = new_page_start_y;
                                        current_line_num = 0;
                                        doc.rect(line_start_x,current_height,table_width,line_height).stroke();
                                        doc.moveTo(line_start_x+table_width*0.15,current_height).lineTo(line_start_x+table_width*0.15, current_height+line_height).stroke();
                                        doc.moveTo(line_start_x+table_width*0.35,current_height).lineTo(line_start_x+table_width*0.35, current_height+line_height).stroke();
                                        current_height = current_height+line_height;
                                        current_line_num++;
                                    }else if(current_page_num > 0&&current_line_num >= other_page_limit){
                                        doc.addPage();
                                        current_page_num++;
                                        current_height = new_page_start_y;
                                        current_line_num = 0;
                                        doc.rect(line_start_x,current_height,table_width,line_height).stroke();
                                        doc.moveTo(line_start_x+table_width*0.15,current_height).lineTo(line_start_x+table_width*0.15, current_height+line_height).stroke();
                                        doc.moveTo(line_start_x+table_width*0.35,current_height).lineTo(line_start_x+table_width*0.35, current_height+line_height).stroke();
                                        current_height = current_height+line_height;
                                        current_line_num++;
                                    }else{
                                        doc.rect(line_start_x,current_height,table_width,line_height).stroke();
                                        doc.moveTo(line_start_x+table_width*0.15,current_height).lineTo(line_start_x+table_width*0.15, current_height+line_height).stroke();
                                        doc.moveTo(line_start_x+table_width*0.35,current_height).lineTo(line_start_x+table_width*0.35, current_height+line_height).stroke();
                                        current_height = current_height+line_height;
                                        current_line_num++;
                                    }
                                }
                            } else {
                                line_num = results.length;
                                for(let i=0;i<line_num;i++){
                                    if(current_page_num === 0&&current_line_num>=first_page_limit){
                                        doc.addPage();
                                        current_page_num++;
                                        current_height = new_page_start_y;
                                        current_line_num = 0;
                                        doc.rect(line_start_x,current_height,table_width,line_height).stroke();
                                        doc.moveTo(line_start_x+table_width*0.15,current_height).lineTo(line_start_x+table_width*0.15, current_height+line_height).stroke();
                                        doc.moveTo(line_start_x+table_width*0.35,current_height).lineTo(line_start_x+table_width*0.35, current_height+line_height).stroke();
                                        doc.font("fonts/songti.ttf").fontSize(font_size).text(moment(results[i]["date"]).format("YYYY.MM.DD"), line_start_x, current_height+font_height_start, {width:table_width*0.15, align:"center"});
                                        doc.font("fonts/songti.ttf").fontSize(font_size).text(results[i]["status"], line_start_x+table_width*0.15, current_height+font_height_start, {width:table_width*0.2, align:"center"});
                                        doc.font("fonts/songti.ttf").fontSize(font_size).text(results[i]["solution"], line_start_x+table_width*0.35, current_height+font_height_start, {width:table_width*0.65, align:"center"});
                                        current_height = current_height+line_height;
                                        current_line_num++;
                                    }else if(current_page_num > 0&&current_line_num >= other_page_limit){
                                        doc.addPage();
                                        current_page_num++;
                                        current_height = new_page_start_y;
                                        current_line_num = 0;
                                        doc.rect(line_start_x,current_height,table_width,line_height).stroke();
                                        doc.moveTo(line_start_x+table_width*0.15,current_height).lineTo(line_start_x+table_width*0.15, current_height+line_height).stroke();
                                        doc.moveTo(line_start_x+table_width*0.35,current_height).lineTo(line_start_x+table_width*0.35, current_height+line_height).stroke();
                                        doc.font("fonts/songti.ttf").fontSize(font_size).text(moment(results[i]["date"]).format("YYYY.MM.DD"), line_start_x, current_height+font_height_start, {width:table_width*0.15, align:"center"});
                                        doc.font("fonts/songti.ttf").fontSize(font_size).text(results[i]["status"], line_start_x+table_width*0.15, current_height+font_height_start, {width:table_width*0.2, align:"center"});
                                        doc.font("fonts/songti.ttf").fontSize(font_size).text(results[i]["solution"], line_start_x+table_width*0.35, current_height+font_height_start, {width:table_width*0.65, align:"center"});
                                        current_height = current_height+line_height;
                                        current_line_num++;
                                    }else{
                                        doc.rect(line_start_x,current_height,table_width,line_height).stroke();
                                        doc.moveTo(line_start_x+table_width*0.15,current_height).lineTo(line_start_x+table_width*0.15, current_height+line_height).stroke();
                                        doc.moveTo(line_start_x+table_width*0.35,current_height).lineTo(line_start_x+table_width*0.35, current_height+line_height).stroke();
                                        doc.font("fonts/songti.ttf").fontSize(font_size).text(moment(results[i]["date"]).format("YYYY.MM.DD"), line_start_x, current_height+font_height_start, {width:table_width*0.15, align:"center"});
                                        doc.font("fonts/songti.ttf").fontSize(font_size).text(results[i]["status"], line_start_x+table_width*0.15, current_height+font_height_start, {width:table_width*0.2, align:"center"});
                                        doc.font("fonts/songti.ttf").fontSize(font_size).text(results[i]["solution"], line_start_x+table_width*0.35, current_height+font_height_start, {width:table_width*0.65, align:"center"});
                                        current_height = current_height+line_height;
                                        current_line_num++;
                                    }
                                }
                            }
                            if(current_page_num === 0&&current_line_num>=first_page_limit){
                                doc.addPage();
                                current_page_num++;
                                current_height = new_page_start_y;
                                current_line_num = 0;
                                doc.rect(line_start_x,current_height,table_width,line_height).stroke();
                                doc.font("fonts/songtibold.ttf").fontSize(11).text("报警系统维修情况", line_start_x+font_width_start, current_height+font_height_start);
                                current_height = current_height+line_height;
                                current_line_num++;
                            }else if(current_page_num > 0&&current_line_num >= other_page_limit){
                                doc.addPage();
                                current_page_num++;
                                current_height = new_page_start_y;
                                current_line_num = 0;
                                doc.rect(line_start_x,current_height,table_width,line_height).stroke();
                                doc.font("fonts/songtibold.ttf").fontSize(11).text("报警系统维修情况", line_start_x+font_width_start, current_height+font_height_start);
                                current_height = current_height+line_height;
                                current_line_num++;
                            }else{
                                doc.rect(line_start_x,current_height,table_width,line_height).stroke();
                                doc.font("fonts/songtibold.ttf").fontSize(11).text("报警系统维修情况", line_start_x+font_width_start, current_height+font_height_start);
                                current_height = current_height+line_height;
                                current_line_num++;
                            }

                            connection.query("select * from repair where date>='"+start_datetime+"' and date<'"+end_datetime+"' and user_id="+user_id, function (error, results) {
                                if (error) {
                                    console.log(error);
                                    res.send(error);
                                } else {
                                    let line_num = 0;
                                    if(current_page_num === 0&&current_line_num>=first_page_limit){
                                        doc.addPage();
                                        current_page_num++;
                                        current_height = new_page_start_y;
                                        current_line_num = 0;
                                        doc.rect(line_start_x,current_height,table_width,line_height).stroke();

                                        doc.moveTo(line_start_x + table_width * 0.15, current_height).lineTo(line_start_x + table_width * 0.15, current_height+line_height).stroke();
                                        doc.moveTo(line_start_x + table_width * 0.4, current_height).lineTo(line_start_x + table_width * 0.4, current_height+line_height).stroke();
                                        doc.moveTo(line_start_x + table_width * 0.7, current_height).lineTo(line_start_x + table_width * 0.7, current_height+line_height).stroke();
                                        doc.moveTo(line_start_x + table_width * 0.85, current_height).lineTo(line_start_x + table_width * 0.85, current_height+line_height).stroke();
                                        doc.font("fonts/songti.ttf").fontSize(font_size).text("日期", line_start_x, current_height + font_height_start, {
                                            width: table_width * 0.15,
                                            align: "center"
                                        });
                                        doc.font("fonts/songti.ttf").fontSize(font_size).text("故障现象", line_start_x + table_width * 0.15, current_height + font_height_start, {
                                            width: table_width * 0.25,
                                            align: "center"
                                        });
                                        doc.font("fonts/songti.ttf").fontSize(font_size).text("维修内容", line_start_x + table_width * 0.4, current_height + font_height_start, {
                                            width: table_width * 0.3,
                                            align: "center"
                                        });
                                        doc.font("fonts/songti.ttf").fontSize(font_size).text("维修器材", line_start_x + table_width * 0.7, current_height + font_height_start, {
                                            width: table_width * 0.15,
                                            align: "center"
                                        });
                                        doc.font("fonts/songti.ttf").fontSize(font_size).text("维修人员", line_start_x + table_width * 0.85, current_height + font_height_start, {
                                            width: table_width * 0.15,
                                            align: "center"
                                        });
                                        current_height = current_height+line_height;
                                        current_line_num++;
                                    }else if(current_page_num > 0&&current_line_num >= other_page_limit){
                                        doc.addPage();
                                        current_page_num++;
                                        current_height = new_page_start_y;
                                        current_line_num = 0;
                                        doc.rect(line_start_x,current_height,table_width,line_height).stroke();
                                        doc.moveTo(line_start_x + table_width * 0.15, current_height).lineTo(line_start_x + table_width * 0.15, current_height+line_height).stroke();
                                        doc.moveTo(line_start_x + table_width * 0.4, current_height).lineTo(line_start_x + table_width * 0.4, current_height+line_height).stroke();
                                        doc.moveTo(line_start_x + table_width * 0.7, current_height).lineTo(line_start_x + table_width * 0.7, current_height+line_height).stroke();
                                        doc.moveTo(line_start_x + table_width * 0.85, current_height).lineTo(line_start_x + table_width * 0.85, current_height+line_height).stroke();
                                        doc.font("fonts/songti.ttf").fontSize(font_size).text("日期", line_start_x, current_height + font_height_start, {
                                            width: table_width * 0.15,
                                            align: "center"
                                        });
                                        doc.font("fonts/songti.ttf").fontSize(font_size).text("故障现象", line_start_x + table_width * 0.15, current_height + font_height_start, {
                                            width: table_width * 0.25,
                                            align: "center"
                                        });
                                        doc.font("fonts/songti.ttf").fontSize(font_size).text("维修内容", line_start_x + table_width * 0.4, current_height + font_height_start, {
                                            width: table_width * 0.3,
                                            align: "center"
                                        });
                                        doc.font("fonts/songti.ttf").fontSize(font_size).text("维修器材", line_start_x + table_width * 0.7, current_height + font_height_start, {
                                            width: table_width * 0.15,
                                            align: "center"
                                        });
                                        doc.font("fonts/songti.ttf").fontSize(font_size).text("维修人员", line_start_x + table_width * 0.85, current_height + font_height_start, {
                                            width: table_width * 0.15,
                                            align: "center"
                                        });
                                        current_height = current_height+line_height;
                                        current_line_num++;
                                    }else{
                                        doc.rect(line_start_x,current_height,table_width,line_height).stroke();
                                        doc.moveTo(line_start_x + table_width * 0.15, current_height).lineTo(line_start_x + table_width * 0.15, current_height+line_height).stroke();
                                        doc.moveTo(line_start_x + table_width * 0.4, current_height).lineTo(line_start_x + table_width * 0.4, current_height+line_height).stroke();
                                        doc.moveTo(line_start_x + table_width * 0.7, current_height).lineTo(line_start_x + table_width * 0.7, current_height+line_height).stroke();
                                        doc.moveTo(line_start_x + table_width * 0.85, current_height).lineTo(line_start_x + table_width * 0.85, current_height+line_height).stroke();
                                        doc.font("fonts/songti.ttf").fontSize(font_size).text("日期", line_start_x, current_height + font_height_start, {
                                            width: table_width * 0.15,
                                            align: "center"
                                        });
                                        doc.font("fonts/songti.ttf").fontSize(font_size).text("故障现象", line_start_x + table_width * 0.15, current_height + font_height_start, {
                                            width: table_width * 0.25,
                                            align: "center"
                                        });
                                        doc.font("fonts/songti.ttf").fontSize(font_size).text("维修内容", line_start_x + table_width * 0.4, current_height + font_height_start, {
                                            width: table_width * 0.3,
                                            align: "center"
                                        });
                                        doc.font("fonts/songti.ttf").fontSize(font_size).text("维修器材", line_start_x + table_width * 0.7, current_height + font_height_start, {
                                            width: table_width * 0.15,
                                            align: "center"
                                        });
                                        doc.font("fonts/songti.ttf").fontSize(font_size).text("维修人员", line_start_x + table_width * 0.85, current_height + font_height_start, {
                                            width: table_width * 0.15,
                                            align: "center"
                                        });
                                        current_height = current_height+line_height;
                                        current_line_num++;
                                    }
                                    if(results.length==0){
                                        line_num = 1;
                                        for(let i=0;i<line_num;i++){
                                            if(current_page_num === 0&&current_line_num>=first_page_limit){
                                                doc.addPage();
                                                current_page_num++;
                                                current_height = new_page_start_y;
                                                current_line_num = 0;
                                                doc.rect(line_start_x,current_height,table_width,line_height).stroke();
                                                doc.moveTo(line_start_x + table_width * 0.15, current_height).lineTo(line_start_x + table_width * 0.15, current_height+line_height).stroke();
                                                doc.moveTo(line_start_x + table_width * 0.4, current_height).lineTo(line_start_x + table_width * 0.4, current_height+line_height).stroke();
                                                doc.moveTo(line_start_x + table_width * 0.7, current_height).lineTo(line_start_x + table_width * 0.7, current_height+line_height).stroke();
                                                doc.moveTo(line_start_x + table_width * 0.85, current_height).lineTo(line_start_x + table_width * 0.85, current_height+line_height).stroke();
                                                current_height = current_height+line_height;
                                                current_line_num++;
                                            }else if(current_page_num > 0&&current_line_num >= other_page_limit){
                                                doc.addPage();
                                                current_page_num++;
                                                current_height = new_page_start_y;
                                                current_line_num = 0;
                                                doc.rect(line_start_x,current_height,table_width,line_height).stroke();
                                                doc.moveTo(line_start_x + table_width * 0.15, current_height).lineTo(line_start_x + table_width * 0.15, current_height+line_height).stroke();
                                                doc.moveTo(line_start_x + table_width * 0.4, current_height).lineTo(line_start_x + table_width * 0.4, current_height+line_height).stroke();
                                                doc.moveTo(line_start_x + table_width * 0.7, current_height).lineTo(line_start_x + table_width * 0.7, current_height+line_height).stroke();
                                                doc.moveTo(line_start_x + table_width * 0.85, current_height).lineTo(line_start_x + table_width * 0.85, current_height+line_height).stroke();
                                                current_height = current_height+line_height;
                                                current_line_num++;
                                            }else{
                                                doc.rect(line_start_x,current_height,table_width,line_height).stroke();
                                                doc.moveTo(line_start_x + table_width * 0.15, current_height).lineTo(line_start_x + table_width * 0.15, current_height+line_height).stroke();
                                                doc.moveTo(line_start_x + table_width * 0.4, current_height).lineTo(line_start_x + table_width * 0.4, current_height+line_height).stroke();
                                                doc.moveTo(line_start_x + table_width * 0.7, current_height).lineTo(line_start_x + table_width * 0.7, current_height+line_height).stroke();
                                                doc.moveTo(line_start_x + table_width * 0.85, current_height).lineTo(line_start_x + table_width * 0.85, current_height+line_height).stroke();
                                                current_height = current_height+line_height;
                                                current_line_num++;
                                            }
                                        }
                                    } else {
                                        line_num = results.length;
                                        for(let i=0;i<line_num;i++){
                                            if(current_page_num === 0&&current_line_num>=first_page_limit){
                                                doc.addPage();
                                                current_page_num++;
                                                current_height = new_page_start_y;
                                                current_line_num = 0;
                                                doc.rect(line_start_x,current_height,table_width,line_height).stroke();
                                                doc.moveTo(line_start_x + table_width * 0.15, current_height).lineTo(line_start_x + table_width * 0.15, current_height+line_height).stroke();
                                                doc.moveTo(line_start_x + table_width * 0.4, current_height).lineTo(line_start_x + table_width * 0.4, current_height+line_height).stroke();
                                                doc.moveTo(line_start_x + table_width * 0.7, current_height).lineTo(line_start_x + table_width * 0.7, current_height+line_height).stroke();
                                                doc.moveTo(line_start_x + table_width * 0.85, current_height).lineTo(line_start_x + table_width * 0.85, current_height+line_height).stroke();
                                                doc.font("fonts/songti.ttf").fontSize(font_size).text(moment(results[i]["date"]).format("YYYY.MM.DD"), line_start_x, current_height + font_height_start, {
                                                    width: table_width * 0.15,
                                                    align: "center"
                                                });
                                                doc.font("fonts/songti.ttf").fontSize(font_size).text(results[i]["status"], line_start_x + table_width * 0.15, current_height + font_height_start, {
                                                    width: table_width * 0.25,
                                                    align: "center"
                                                });
                                                doc.font("fonts/songti.ttf").fontSize(font_size).text(results[i]["content"], line_start_x + table_width * 0.4, current_height + font_height_start, {
                                                    width: table_width * 0.3,
                                                    align: "center"
                                                });
                                                doc.font("fonts/songti.ttf").fontSize(font_size).text(results[i]["material"], line_start_x + table_width * 0.7, current_height + font_height_start, {
                                                    width: table_width * 0.15,
                                                    align: "center"
                                                });
                                                doc.font("fonts/songti.ttf").fontSize(font_size).text(results[i]["staff"], line_start_x + table_width * 0.85, current_height + font_height_start, {
                                                    width: table_width * 0.15,
                                                    align: "center"
                                                });
                                                current_height = current_height+line_height;
                                                current_line_num++;
                                            }else if(current_page_num > 0&&current_line_num >= other_page_limit){
                                                doc.addPage();
                                                current_page_num++;
                                                current_height = new_page_start_y;
                                                current_line_num = 0;
                                                doc.rect(line_start_x,current_height,table_width,line_height).stroke();
                                                doc.moveTo(line_start_x + table_width * 0.15, current_height).lineTo(line_start_x + table_width * 0.15, current_height+line_height).stroke();
                                                doc.moveTo(line_start_x + table_width * 0.4, current_height).lineTo(line_start_x + table_width * 0.4, current_height+line_height).stroke();
                                                doc.moveTo(line_start_x + table_width * 0.7, current_height).lineTo(line_start_x + table_width * 0.7, current_height+line_height).stroke();
                                                doc.moveTo(line_start_x + table_width * 0.85, current_height).lineTo(line_start_x + table_width * 0.85, current_height+line_height).stroke();
                                                doc.font("fonts/songti.ttf").fontSize(font_size).text(moment(results[i]["date"]).format("YYYY.MM.DD"), line_start_x, current_height + font_height_start, {
                                                    width: table_width * 0.15,
                                                    align: "center"
                                                });
                                                doc.font("fonts/songti.ttf").fontSize(font_size).text(results[i]["status"], line_start_x + table_width * 0.15, current_height + font_height_start, {
                                                    width: table_width * 0.25,
                                                    align: "center"
                                                });
                                                doc.font("fonts/songti.ttf").fontSize(font_size).text(results[i]["content"], line_start_x + table_width * 0.4, current_height + font_height_start, {
                                                    width: table_width * 0.3,
                                                    align: "center"
                                                });
                                                doc.font("fonts/songti.ttf").fontSize(font_size).text(results[i]["material"], line_start_x + table_width * 0.7, current_height + font_height_start, {
                                                    width: table_width * 0.15,
                                                    align: "center"
                                                });
                                                doc.font("fonts/songti.ttf").fontSize(font_size).text(results[i]["staff"], line_start_x + table_width * 0.85, current_height + font_height_start, {
                                                    width: table_width * 0.15,
                                                    align: "center"
                                                });
                                                current_height = current_height+line_height;
                                                current_line_num++;
                                            }else{
                                                doc.rect(line_start_x,current_height,table_width,line_height).stroke();
                                                doc.moveTo(line_start_x + table_width * 0.15, current_height).lineTo(line_start_x + table_width * 0.15, current_height+line_height).stroke();
                                                doc.moveTo(line_start_x + table_width * 0.4, current_height).lineTo(line_start_x + table_width * 0.4, current_height+line_height).stroke();
                                                doc.moveTo(line_start_x + table_width * 0.7, current_height).lineTo(line_start_x + table_width * 0.7, current_height+line_height).stroke();
                                                doc.moveTo(line_start_x + table_width * 0.85, current_height).lineTo(line_start_x + table_width * 0.85, current_height+line_height).stroke();
                                                doc.font("fonts/songti.ttf").fontSize(font_size).text(moment(results[i]["date"]).format("YYYY.MM.DD"), line_start_x, current_height + font_height_start, {
                                                    width: table_width * 0.15,
                                                    align: "center"
                                                });
                                                doc.font("fonts/songti.ttf").fontSize(font_size).text(results[i]["status"], line_start_x + table_width * 0.15, current_height + font_height_start, {
                                                    width: table_width * 0.25,
                                                    align: "center"
                                                });
                                                doc.font("fonts/songti.ttf").fontSize(font_size).text(results[i]["content"], line_start_x + table_width * 0.4, current_height + font_height_start, {
                                                    width: table_width * 0.3,
                                                    align: "center"
                                                });
                                                doc.font("fonts/songti.ttf").fontSize(font_size).text(results[i]["material"], line_start_x + table_width * 0.7, current_height + font_height_start, {
                                                    width: table_width * 0.15,
                                                    align: "center"
                                                });
                                                doc.font("fonts/songti.ttf").fontSize(font_size).text(results[i]["staff"], line_start_x + table_width * 0.85, current_height + font_height_start, {
                                                    width: table_width * 0.15,
                                                    align: "center"
                                                });
                                                current_height = current_height+line_height;
                                                current_line_num++;
                                            }
                                        }
                                    }
                                    if(current_page_num === 0&&current_line_num>=first_page_limit){
                                        doc.addPage();
                                        current_page_num++;
                                        current_height = new_page_start_y;
                                        current_line_num = 0;
                                        doc.rect(line_start_x,current_height,table_width,line_height).stroke();
                                        doc.font("fonts/songtibold.ttf").fontSize(11).text("用户测试", line_start_x+font_width_start, current_height+font_height_start);
                                        current_height = current_height+line_height;
                                        current_line_num++;
                                    }else if(current_page_num > 0&&current_line_num >= other_page_limit){
                                        doc.addPage();
                                        current_page_num++;
                                        current_height = new_page_start_y;
                                        current_line_num = 0;
                                        doc.rect(line_start_x,current_height,table_width,line_height).stroke();
                                        doc.font("fonts/songtibold.ttf").fontSize(11).text("用户测试", line_start_x+font_width_start, current_height+font_height_start);
                                        current_height = current_height+line_height;
                                        current_line_num++;
                                    }else{
                                        doc.rect(line_start_x,current_height,table_width,line_height).stroke();
                                        doc.font("fonts/songtibold.ttf").fontSize(11).text("用户测试", line_start_x+font_width_start, current_height+font_height_start);
                                        current_height = current_height+line_height;
                                        current_line_num++;
                                    }
                                    connection.query("select * from test where datetime>='"+start_datetime+"' and datetime<'"+end_datetime+"' and user_id="+user_id, function (error, results) {
                                        if (error) {
                                            console.log(error);
                                            res.send(error);
                                        } else {
                                            let line_num = 0;
                                            if(current_page_num === 0&&current_line_num>=first_page_limit){
                                                doc.addPage();
                                                current_page_num++;
                                                current_height = new_page_start_y;
                                                current_line_num = 0;
                                                doc.rect(line_start_x,current_height,table_width,line_height).stroke();
                                                doc.moveTo(line_start_x + table_width * 0.15, current_height).lineTo(line_start_x + table_width * 0.15, current_height+line_height).stroke();
                                                doc.moveTo(line_start_x + table_width * 0.25, current_height).lineTo(line_start_x + table_width * 0.25, current_height+line_height).stroke();
                                                doc.moveTo(line_start_x + table_width * 0.4, current_height).lineTo(line_start_x + table_width * 0.4, current_height+line_height).stroke();
                                                doc.moveTo(line_start_x + table_width * 0.55, current_height).lineTo(line_start_x + table_width * 0.55, current_height+line_height).stroke();
                                                doc.moveTo(line_start_x + table_width * 0.7, current_height).lineTo(line_start_x + table_width * 0.7, current_height+line_height).stroke();
                                                doc.moveTo(line_start_x + table_width * 0.8, current_height).lineTo(line_start_x + table_width * 0.8, current_height+line_height).stroke();
                                                doc.font("fonts/songti.ttf").fontSize(font_size).text("日期", line_start_x, current_height + font_height_start, {
                                                    width: table_width * 0.15,
                                                    align: "center"
                                                });
                                                doc.font("fonts/songti.ttf").fontSize(font_size).text("时间", line_start_x + table_width * 0.15, current_height + font_height_start, {
                                                    width: table_width * 0.1,
                                                    align: "center"
                                                });
                                                doc.font("fonts/songti.ttf").fontSize(font_size).text("手动测试", line_start_x + table_width * 0.25, current_height + font_height_start, {
                                                    width: table_width * 0.15,
                                                    align: "center"
                                                });
                                                doc.font("fonts/songti.ttf").fontSize(font_size).text("报警防区", line_start_x + table_width * 0.4, current_height + font_height_start, {
                                                    width: table_width * 0.15,
                                                    align: "center"
                                                });
                                                doc.font("fonts/songti.ttf").fontSize(font_size).text("防区位置", line_start_x + table_width * 0.55, current_height + font_height_start, {
                                                    width: table_width * 0.15,
                                                    align: "center"
                                                });
                                                doc.font("fonts/songti.ttf").fontSize(font_size).text("报警次数", line_start_x + table_width * 0.7, current_height + font_height_start, {
                                                    width: table_width * 0.1,
                                                    align: "center"
                                                });
                                                doc.font("fonts/songti.ttf").fontSize(font_size).text("用户电话", line_start_x + table_width * 0.8, current_height + font_height_start, {
                                                    width: table_width * 0.2,
                                                    align: "center"
                                                });
                                                current_height = current_height+line_height;
                                                current_line_num++;
                                            }else if(current_page_num > 0&&current_line_num >= other_page_limit){
                                                doc.addPage();
                                                current_page_num++;
                                                current_height = new_page_start_y;
                                                current_line_num = 0;
                                                doc.rect(line_start_x,current_height,table_width,line_height).stroke();
                                                doc.moveTo(line_start_x + table_width * 0.15, current_height).lineTo(line_start_x + table_width * 0.15, current_height+line_height).stroke();
                                                doc.moveTo(line_start_x + table_width * 0.25, current_height).lineTo(line_start_x + table_width * 0.25, current_height+line_height).stroke();
                                                doc.moveTo(line_start_x + table_width * 0.4, current_height).lineTo(line_start_x + table_width * 0.4, current_height+line_height).stroke();
                                                doc.moveTo(line_start_x + table_width * 0.55, current_height).lineTo(line_start_x + table_width * 0.55, current_height+line_height).stroke();
                                                doc.moveTo(line_start_x + table_width * 0.7, current_height).lineTo(line_start_x + table_width * 0.7, current_height+line_height).stroke();
                                                doc.moveTo(line_start_x + table_width * 0.8, current_height).lineTo(line_start_x + table_width * 0.8, current_height+line_height).stroke();
                                                doc.font("fonts/songti.ttf").fontSize(font_size).text("日期", line_start_x, current_height + font_height_start, {
                                                    width: table_width * 0.15,
                                                    align: "center"
                                                });
                                                doc.font("fonts/songti.ttf").fontSize(font_size).text("时间", line_start_x + table_width * 0.15, current_height + font_height_start, {
                                                    width: table_width * 0.1,
                                                    align: "center"
                                                });
                                                doc.font("fonts/songti.ttf").fontSize(font_size).text("手动测试", line_start_x + table_width * 0.25, current_height + font_height_start, {
                                                    width: table_width * 0.15,
                                                    align: "center"
                                                });
                                                doc.font("fonts/songti.ttf").fontSize(font_size).text("报警防区", line_start_x + table_width * 0.4, current_height + font_height_start, {
                                                    width: table_width * 0.15,
                                                    align: "center"
                                                });
                                                doc.font("fonts/songti.ttf").fontSize(font_size).text("防区位置", line_start_x + table_width * 0.55, current_height + font_height_start, {
                                                    width: table_width * 0.15,
                                                    align: "center"
                                                });
                                                doc.font("fonts/songti.ttf").fontSize(font_size).text("报警次数", line_start_x + table_width * 0.7, current_height + font_height_start, {
                                                    width: table_width * 0.1,
                                                    align: "center"
                                                });
                                                doc.font("fonts/songti.ttf").fontSize(font_size).text("用户电话", line_start_x + table_width * 0.8, current_height + font_height_start, {
                                                    width: table_width * 0.2,
                                                    align: "center"
                                                });
                                                current_height = current_height+line_height;
                                                current_line_num++;
                                            }else{
                                                doc.rect(line_start_x,current_height,table_width,line_height).stroke();
                                                doc.moveTo(line_start_x + table_width * 0.15, current_height).lineTo(line_start_x + table_width * 0.15, current_height+line_height).stroke();
                                                doc.moveTo(line_start_x + table_width * 0.25, current_height).lineTo(line_start_x + table_width * 0.25, current_height+line_height).stroke();
                                                doc.moveTo(line_start_x + table_width * 0.4, current_height).lineTo(line_start_x + table_width * 0.4, current_height+line_height).stroke();
                                                doc.moveTo(line_start_x + table_width * 0.55, current_height).lineTo(line_start_x + table_width * 0.55, current_height+line_height).stroke();
                                                doc.moveTo(line_start_x + table_width * 0.7, current_height).lineTo(line_start_x + table_width * 0.7, current_height+line_height).stroke();
                                                doc.moveTo(line_start_x + table_width * 0.8, current_height).lineTo(line_start_x + table_width * 0.8, current_height+line_height).stroke();
                                                doc.font("fonts/songti.ttf").fontSize(font_size).text("日期", line_start_x, current_height + font_height_start, {
                                                    width: table_width * 0.15,
                                                    align: "center"
                                                });
                                                doc.font("fonts/songti.ttf").fontSize(font_size).text("时间", line_start_x + table_width * 0.15, current_height + font_height_start, {
                                                    width: table_width * 0.1,
                                                    align: "center"
                                                });
                                                doc.font("fonts/songti.ttf").fontSize(font_size).text("手动测试", line_start_x + table_width * 0.25, current_height + font_height_start, {
                                                    width: table_width * 0.15,
                                                    align: "center"
                                                });
                                                doc.font("fonts/songti.ttf").fontSize(font_size).text("报警防区", line_start_x + table_width * 0.4, current_height + font_height_start, {
                                                    width: table_width * 0.15,
                                                    align: "center"
                                                });
                                                doc.font("fonts/songti.ttf").fontSize(font_size).text("防区位置", line_start_x + table_width * 0.55, current_height + font_height_start, {
                                                    width: table_width * 0.15,
                                                    align: "center"
                                                });
                                                doc.font("fonts/songti.ttf").fontSize(font_size).text("报警次数", line_start_x + table_width * 0.7, current_height + font_height_start, {
                                                    width: table_width * 0.1,
                                                    align: "center"
                                                });
                                                doc.font("fonts/songti.ttf").fontSize(font_size).text("用户电话", line_start_x + table_width * 0.8, current_height + font_height_start, {
                                                    width: table_width * 0.2,
                                                    align: "center"
                                                });
                                                current_height = current_height+line_height;
                                                current_line_num++;
                                            }
                                            if(results.length==0){
                                                line_num = 1;
                                                for(let i=0;i<line_num;i++){
                                                    if(current_page_num === 0&&current_line_num>=first_page_limit){
                                                        doc.addPage();
                                                        current_page_num++;
                                                        current_height = new_page_start_y;
                                                        current_line_num = 0;
                                                        doc.rect(line_start_x,current_height,table_width,line_height).stroke();
                                                        doc.moveTo(line_start_x + table_width * 0.15, current_height).lineTo(line_start_x + table_width * 0.15, current_height+line_height).stroke();
                                                        doc.moveTo(line_start_x + table_width * 0.25, current_height).lineTo(line_start_x + table_width * 0.25, current_height+line_height).stroke();
                                                        doc.moveTo(line_start_x + table_width * 0.4, current_height).lineTo(line_start_x + table_width * 0.4, current_height+line_height).stroke();
                                                        doc.moveTo(line_start_x + table_width * 0.55, current_height).lineTo(line_start_x + table_width * 0.55, current_height+line_height).stroke();
                                                        doc.moveTo(line_start_x + table_width * 0.7, current_height).lineTo(line_start_x + table_width * 0.7, current_height+line_height).stroke();
                                                        doc.moveTo(line_start_x + table_width * 0.8, current_height).lineTo(line_start_x + table_width * 0.8, current_height+line_height).stroke();
                                                        current_height = current_height+line_height;
                                                        current_line_num++;
                                                    }else if(current_page_num > 0&&current_line_num >= other_page_limit){
                                                        doc.addPage();
                                                        current_page_num++;
                                                        current_height = new_page_start_y;
                                                        current_line_num = 0;
                                                        doc.rect(line_start_x,current_height,table_width,line_height).stroke();
                                                        doc.moveTo(line_start_x + table_width * 0.15, current_height).lineTo(line_start_x + table_width * 0.15, current_height+line_height).stroke();
                                                        doc.moveTo(line_start_x + table_width * 0.25, current_height).lineTo(line_start_x + table_width * 0.25, current_height+line_height).stroke();
                                                        doc.moveTo(line_start_x + table_width * 0.4, current_height).lineTo(line_start_x + table_width * 0.4, current_height+line_height).stroke();
                                                        doc.moveTo(line_start_x + table_width * 0.55, current_height).lineTo(line_start_x + table_width * 0.55, current_height+line_height).stroke();
                                                        doc.moveTo(line_start_x + table_width * 0.7, current_height).lineTo(line_start_x + table_width * 0.7, current_height+line_height).stroke();
                                                        doc.moveTo(line_start_x + table_width * 0.8, current_height).lineTo(line_start_x + table_width * 0.8, current_height+line_height).stroke();
                                                        current_height = current_height+line_height;
                                                        current_line_num++;
                                                    }else{
                                                        doc.rect(line_start_x,current_height,table_width,line_height).stroke();
                                                        doc.moveTo(line_start_x + table_width * 0.15, current_height).lineTo(line_start_x + table_width * 0.15, current_height+line_height).stroke();
                                                        doc.moveTo(line_start_x + table_width * 0.25, current_height).lineTo(line_start_x + table_width * 0.25, current_height+line_height).stroke();
                                                        doc.moveTo(line_start_x + table_width * 0.4, current_height).lineTo(line_start_x + table_width * 0.4, current_height+line_height).stroke();
                                                        doc.moveTo(line_start_x + table_width * 0.55, current_height).lineTo(line_start_x + table_width * 0.55, current_height+line_height).stroke();
                                                        doc.moveTo(line_start_x + table_width * 0.7, current_height).lineTo(line_start_x + table_width * 0.7, current_height+line_height).stroke();
                                                        doc.moveTo(line_start_x + table_width * 0.8, current_height).lineTo(line_start_x + table_width * 0.8, current_height+line_height).stroke();
                                                        current_height = current_height+line_height;
                                                        current_line_num++;
                                                    }
                                                }
                                            } else {
                                                line_num = results.length;
                                                for(let i=0;i<line_num;i++){
                                                    if(current_page_num === 0&&current_line_num>=first_page_limit){
                                                        doc.addPage();
                                                        current_page_num++;
                                                        current_height = new_page_start_y;
                                                        current_line_num = 0;
                                                        doc.rect(line_start_x,current_height,table_width,line_height).stroke();
                                                        doc.moveTo(line_start_x + table_width * 0.15, current_height).lineTo(line_start_x + table_width * 0.15, current_height+line_height).stroke();
                                                        doc.moveTo(line_start_x + table_width * 0.25, current_height).lineTo(line_start_x + table_width * 0.25, current_height+line_height).stroke();
                                                        doc.moveTo(line_start_x + table_width * 0.4, current_height).lineTo(line_start_x + table_width * 0.4, current_height+line_height).stroke();
                                                        doc.moveTo(line_start_x + table_width * 0.55, current_height).lineTo(line_start_x + table_width * 0.55, current_height+line_height).stroke();
                                                        doc.moveTo(line_start_x + table_width * 0.7, current_height).lineTo(line_start_x + table_width * 0.7, current_height+line_height).stroke();
                                                        doc.moveTo(line_start_x + table_width * 0.8, current_height).lineTo(line_start_x + table_width * 0.8, current_height+line_height).stroke();
                                                        doc.font("fonts/songti.ttf").fontSize(font_size).text(moment(results[i]["datetime"]).format("YYYY.MM.DD"), line_start_x, current_height + font_height_start, {
                                                            width: table_width * 0.15,
                                                            align: "center"
                                                        });
                                                        doc.font("fonts/songti.ttf").fontSize(font_size).text(moment(results[i]["datetime"]).format("HH:mm"), line_start_x + table_width * 0.15, current_height + font_height_start, {
                                                            width: table_width * 0.1,
                                                            align: "center"
                                                        });
                                                        doc.font("fonts/songti.ttf").fontSize(font_size).text(results[i]["test_type"], line_start_x + table_width * 0.25, current_height + font_height_start, {
                                                            width: table_width * 0.15,
                                                            align: "center"
                                                        });
                                                        doc.font("fonts/songti.ttf").fontSize(font_size).text(results[i]["sector"], line_start_x + table_width * 0.4, current_height + font_height_start, {
                                                            width: table_width * 0.15,
                                                            align: "center"
                                                        });
                                                        doc.font("fonts/songti.ttf").fontSize(font_size).text(results[i]["position"], line_start_x + table_width * 0.55, current_height + font_height_start, {
                                                            width: table_width * 0.15,
                                                            align: "center"
                                                        });
                                                        doc.font("fonts/songti.ttf").fontSize(font_size).text(results[i]["report_num"], line_start_x + table_width * 0.7, current_height + font_height_start, {
                                                            width: table_width * 0.1,
                                                            align: "center"
                                                        });
                                                        doc.font("fonts/songti.ttf").fontSize(font_size).text(results[i]["phone_number"], line_start_x + table_width * 0.8, current_height + font_height_start, {
                                                            width: table_width * 0.2,
                                                            align: "center"
                                                        });
                                                        current_height = current_height+line_height;
                                                        current_line_num++;
                                                    }else if(current_page_num > 0&&current_line_num >= other_page_limit){
                                                        doc.addPage();
                                                        current_page_num++;
                                                        current_height = new_page_start_y;
                                                        current_line_num = 0;
                                                        doc.rect(line_start_x,current_height,table_width,line_height).stroke();
                                                        doc.moveTo(line_start_x + table_width * 0.15, current_height).lineTo(line_start_x + table_width * 0.15, current_height+line_height).stroke();
                                                        doc.moveTo(line_start_x + table_width * 0.25, current_height).lineTo(line_start_x + table_width * 0.25, current_height+line_height).stroke();
                                                        doc.moveTo(line_start_x + table_width * 0.4, current_height).lineTo(line_start_x + table_width * 0.4, current_height+line_height).stroke();
                                                        doc.moveTo(line_start_x + table_width * 0.55, current_height).lineTo(line_start_x + table_width * 0.55, current_height+line_height).stroke();
                                                        doc.moveTo(line_start_x + table_width * 0.7, current_height).lineTo(line_start_x + table_width * 0.7, current_height+line_height).stroke();
                                                        doc.moveTo(line_start_x + table_width * 0.8, current_height).lineTo(line_start_x + table_width * 0.8, current_height+line_height).stroke();
                                                        doc.font("fonts/songti.ttf").fontSize(font_size).text(moment(results[i]["datetime"]).format("YYYY.MM.DD"), line_start_x, current_height + font_height_start, {
                                                            width: table_width * 0.15,
                                                            align: "center"
                                                        });
                                                        doc.font("fonts/songti.ttf").fontSize(font_size).text(moment(results[i]["datetime"]).format("HH:mm"), line_start_x + table_width * 0.15, current_height + font_height_start, {
                                                            width: table_width * 0.1,
                                                            align: "center"
                                                        });
                                                        doc.font("fonts/songti.ttf").fontSize(font_size).text(results[i]["test_type"], line_start_x + table_width * 0.25, current_height + font_height_start, {
                                                            width: table_width * 0.15,
                                                            align: "center"
                                                        });
                                                        doc.font("fonts/songti.ttf").fontSize(font_size).text(results[i]["sector"], line_start_x + table_width * 0.4, current_height + font_height_start, {
                                                            width: table_width * 0.15,
                                                            align: "center"
                                                        });
                                                        doc.font("fonts/songti.ttf").fontSize(font_size).text(results[i]["position"], line_start_x + table_width * 0.55, current_height + font_height_start, {
                                                            width: table_width * 0.15,
                                                            align: "center"
                                                        });
                                                        doc.font("fonts/songti.ttf").fontSize(font_size).text(results[i]["report_num"], line_start_x + table_width * 0.7, current_height + font_height_start, {
                                                            width: table_width * 0.1,
                                                            align: "center"
                                                        });
                                                        doc.font("fonts/songti.ttf").fontSize(font_size).text(results[i]["phone_number"], line_start_x + table_width * 0.8, current_height + font_height_start, {
                                                            width: table_width * 0.2,
                                                            align: "center"
                                                        });
                                                        current_height = current_height+line_height;
                                                        current_line_num++;
                                                    }else{
                                                        doc.rect(line_start_x,current_height,table_width,line_height).stroke();
                                                        doc.moveTo(line_start_x + table_width * 0.15, current_height).lineTo(line_start_x + table_width * 0.15, current_height+line_height).stroke();
                                                        doc.moveTo(line_start_x + table_width * 0.25, current_height).lineTo(line_start_x + table_width * 0.25, current_height+line_height).stroke();
                                                        doc.moveTo(line_start_x + table_width * 0.4, current_height).lineTo(line_start_x + table_width * 0.4, current_height+line_height).stroke();
                                                        doc.moveTo(line_start_x + table_width * 0.55, current_height).lineTo(line_start_x + table_width * 0.55, current_height+line_height).stroke();
                                                        doc.moveTo(line_start_x + table_width * 0.7, current_height).lineTo(line_start_x + table_width * 0.7, current_height+line_height).stroke();
                                                        doc.moveTo(line_start_x + table_width * 0.8, current_height).lineTo(line_start_x + table_width * 0.8, current_height+line_height).stroke();
                                                        doc.font("fonts/songti.ttf").fontSize(font_size).text(moment(results[i]["datetime"]).format("YYYY.MM.DD"), line_start_x, current_height + font_height_start, {
                                                            width: table_width * 0.15,
                                                            align: "center"
                                                        });
                                                        doc.font("fonts/songti.ttf").fontSize(font_size).text(moment(results[i]["datetime"]).format("HH:mm"), line_start_x + table_width * 0.15, current_height + font_height_start, {
                                                            width: table_width * 0.1,
                                                            align: "center"
                                                        });
                                                        doc.font("fonts/songti.ttf").fontSize(font_size).text(results[i]["test_type"], line_start_x + table_width * 0.25, current_height + font_height_start, {
                                                            width: table_width * 0.15,
                                                            align: "center"
                                                        });
                                                        doc.font("fonts/songti.ttf").fontSize(font_size).text(results[i]["sector"], line_start_x + table_width * 0.4, current_height + font_height_start, {
                                                            width: table_width * 0.15,
                                                            align: "center"
                                                        });
                                                        doc.font("fonts/songti.ttf").fontSize(font_size).text(results[i]["position"], line_start_x + table_width * 0.55, current_height + font_height_start, {
                                                            width: table_width * 0.15,
                                                            align: "center"
                                                        });
                                                        doc.font("fonts/songti.ttf").fontSize(font_size).text(results[i]["report_num"], line_start_x + table_width * 0.7, current_height + font_height_start, {
                                                            width: table_width * 0.1,
                                                            align: "center"
                                                        });
                                                        doc.font("fonts/songti.ttf").fontSize(font_size).text(results[i]["phone_number"], line_start_x + table_width * 0.8, current_height + font_height_start, {
                                                            width: table_width * 0.2,
                                                            align: "center"
                                                        });
                                                        current_height = current_height+line_height;
                                                        current_line_num++;
                                                    }
                                                }
                                            }

                                        }
                                        doc.end();
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });

    stream.on('finish', function () {
        res.type('application/pdf');
        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
        res.sendFile(path.join(__dirname,'..','file','Aim.pdf'));
    });

};

function getNextMonth(date) {
    const arr = date.split('-');
    const year = arr[0];
    const month = arr[1];
    let year2 = year;
    let month2 = parseInt(month) + 1;
    if (month2 == 13) {
        year2 = parseInt(year2) + 1;
        month2 = 1;
    }
    if (month2 < 10) {
        month2 = '0' + month2;
    }

    const t2 = year2 + '-' + month2;
    return t2;
}