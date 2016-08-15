package com.wzq.web.controller;

import com.wzq.web.model.User;
import com.wzq.web.result.BaseResult;
import com.wzq.web.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
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

    @RequestMapping(value = "/user_list.html")
    public ModelAndView addApply() {
        ModelAndView mav = new ModelAndView("/user");
        List<User> userList = userService.getAllUserList();
        mav.addObject("userList", userList);
        return mav;
    }

    /**
     * 删除值
     *
     * @param id
     * @return
     */
    @RequestMapping(value = "/delete")
    public String delete(@RequestParam("id") String id) {
        userService.delUserById(Integer.valueOf(id));
        return "redirect:user_list.html";
    }

    /**
     * 添加用户页面
     *
     * @return
     */
    @RequestMapping(value = "add_user.html")
    public ModelAndView addUser() {
        ModelAndView mav = new ModelAndView("add_user");
        return mav;
    }


    @RequestMapping(value = "oa/data")
    @ResponseBody
    public BaseResult webPostData(HttpServletRequest request,
                                  @RequestBody User user) {
        return new BaseResult();
    }

}
