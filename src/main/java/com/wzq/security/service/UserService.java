package com.wzq.security.service;

import com.wzq.security.model.User;

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
