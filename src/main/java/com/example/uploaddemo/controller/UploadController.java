package com.example.uploaddemo.controller;

import com.example.uploaddemo.util.RestResponse;
import com.example.uploaddemo.util.Utils;
import net.coobird.thumbnailator.Thumbnails;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang.RandomStringUtils;
import org.apache.commons.lang.time.DateFormatUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import java.awt.image.BufferedImage;
import java.io.File;

@RestController
@RequestMapping("upload")
public class UploadController {

	@Value("${spring.web.upload-location}") private String uploadLocation;
	private static final String UPLOAD_CONTEXT = "upload/engine";
	private static final Integer MAX_HEIGHT_OR_WIDTH = 1920;

	@CrossOrigin
	@RequestMapping(method= RequestMethod.POST)
	public Object upload(String uploadPath, @RequestParam MultipartFile uploadFile, HttpServletRequest request) throws Exception {

		File directory = new File(uploadLocation, UPLOAD_CONTEXT);
		uploadPath = uploadPath == null? DateFormatUtils.format(System.currentTimeMillis(), "yyyy-MM") : uploadPath;
		directory = new File(directory, uploadPath);
		if (!directory.exists()) directory.mkdirs();

		// 文件扩展名
		String extension = FilenameUtils.getExtension(uploadFile.getOriginalFilename());
    	String fileName = DateFormatUtils.format(System.currentTimeMillis(), "yyyyMMddHHmmssSSS") + RandomStringUtils.randomAlphanumeric(1) + "." + extension;
		File file = new File(directory, fileName);

		if (Utils.isImage(extension)) {

			BufferedImage bufferedImage = ImageIO.read(uploadFile.getInputStream());
			int height = bufferedImage.getHeight();
			int width = bufferedImage.getWidth();
			if (height > MAX_HEIGHT_OR_WIDTH || width > MAX_HEIGHT_OR_WIDTH) {
				Thumbnails.of(bufferedImage).imageType(BufferedImage.TYPE_INT_ARGB).size(MAX_HEIGHT_OR_WIDTH, MAX_HEIGHT_OR_WIDTH).outputQuality(0.6f).toFile(file);
			} else {
				Thumbnails.of(bufferedImage).imageType(BufferedImage.TYPE_INT_ARGB).scale(1.0f).outputQuality(0.6f).toFile(file);
			}

		} else {
			uploadFile.transferTo(file);
		}
		String path = request.getContextPath();
		String url = file.getAbsolutePath().replace(uploadLocation, "");
		url = FilenameUtils.normalize(path+"/"+url, true);

		return RestResponse.ok().put("url", url);
	}
    
}
