package com.wzq.security.dao;

import com.wzq.security.model.User;

import java.util.List;

/**
 * @Author:wangzhenqing
 * @Date:
 * @Description:
 */

public interface UserDaoMapper {
    User getUserById(int id);
    void setAdminById(int id, String admin);
    void delUserById(int id);
    List<User> getAllUsers();
}
