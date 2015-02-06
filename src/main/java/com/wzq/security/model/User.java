package com.wzq.security.model;

/**
 * @Author:wangzhenqing
 * @Date:
 * @Description:
 */
public class User {
    private int id;
    private String name;
    private String admin;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAdmin() {
        return admin;
    }

    public void setAdmin(String admin) {
        this.admin = admin;
    }
}
