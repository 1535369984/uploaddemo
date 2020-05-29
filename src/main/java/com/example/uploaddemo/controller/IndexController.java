package com.example.uploaddemo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @Description :
 * Created by WL on 2020/5/29
 */
@RequestMapping("")
@Controller
public class IndexController {

    @GetMapping("index")
    public String index() {
        return "index";
    }

    @GetMapping("detail")
    public String detail() {
        return "detail";
    }

    @GetMapping("echo")
    public String echo() {
        return "echo";
    }
}
