package com.wzq.web.service;

import com.wzq.web.model.User;

import java.util.List;

/**
 * @Author:wangzhenqing
 * @Date:
 * @Description:
 */
public interface UserService {
    User getById(int id);
    void setAdminById(int id, String admin);
    void delUserById(int id);
    List<User> getAllUserList();
}
