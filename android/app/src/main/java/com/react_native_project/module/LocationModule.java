package com.react_native_project.module;

import android.content.Context;
import android.location.Address;
import android.location.Criteria;
import android.location.Geocoder;
import android.location.Location;
import android.location.LocationManager;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.IOException;
import java.util.List;
import java.util.Locale;

public class LocationModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext mContext;
    public LocationModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;
    }

    /**
     * @return js调用的模块名
     */
    @Override
    public String getName() {
        return "LocationModule";
    }


    /**
     * 使用ReactMethod注解，使这个方法被js调用
     */
    @ReactMethod
    public void getLocation(Callback locationCallback) {
        // 设置配置信息
        Criteria c = new Criteria();
        // 设置耗电量为低耗电
        c.setPowerRequirement(Criteria.POWER_LOW);
        // 设置海拔不需要
        c.setAltitudeRequired(false);
        // 设置导向不需要
        c.setBearingRequired(false);
        // 设置精度为低
        c.setAccuracy(Criteria.ACCURACY_LOW);
        // 设置成本为不需要
        c.setCostAllowed(false);

        LocationManager manager = (LocationManager) mContext.getSystemService(Context.LOCATION_SERVICE);
        String bestProvider = manager.getBestProvider(c, true);
        // 得到定位信息
        Location location = null;
        location = manager.getLastKnownLocation(bestProvider);
        // 如果没有最好的定位方案则手动配置
        if (null == location){
            if (manager.isProviderEnabled(LocationManager.GPS_PROVIDER)){
                location = manager.getLastKnownLocation(LocationManager.GPS_PROVIDER);
            }else if (manager.isProviderEnabled(LocationManager.NETWORK_PROVIDER)) {
                location = manager.getLastKnownLocation(LocationManager.NETWORK_PROVIDER);
            }else  if (manager.isProviderEnabled(LocationManager.PASSIVE_PROVIDER)){
                location = manager.getLastKnownLocation(LocationManager.GPS_PROVIDER);
            }
        }

        if(null != location){
            // 获取纬度
            double lat = location.getLatitude();
            // 获取经度
            double lng = location.getLongitude();

            // 通过地理编码的到具体位置信息
            Geocoder geocoder = new Geocoder(mContext, Locale.CHINESE);
            List<Address> addresses = null;
            try {
                addresses = geocoder.getFromLocation(location.getLatitude(), location.getLongitude(), 1);
            } catch (IOException e) {
                e.printStackTrace();
            }
//            if (addresses.size()<=0){
//                // Log.i(TAG, "获取地址失败!");
//            }
            Address address = addresses.get(0);
            String country = address.getCountryName();//得到国家
            String locality = address.getLocality();//得到城市

            locationCallback.invoke(lat,lng,country,locality);
        }else{
            locationCallback.invoke(false);
        }
    }
}
