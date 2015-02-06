package com.wzq.security.controller;

import com.wzq.security.model.User;
import com.wzq.security.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * @Author:wangzhenqing
 * @Date:
 * @Description:
 */

@Controller
public class UserController {
    @Autowired(required = true)
    private UserService userService;

    @RequestMapping(value = "/users")
    public ModelAndView addApply(HttpServletRequest request) {
        ModelAndView mav = new ModelAndView("/user");
        List<User> userList = userService.getAllUserList();
        mav.addObject("userList", userList);
        return mav;
    }
}
