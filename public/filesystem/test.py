import winreg
import wmi

def get_bluetooth_adapters_win32():
    """使用 WMI 获取蓝牙适配器详细信息"""
    try:
        c = wmi.WMI()
        adapters = []
        
        # 查询蓝牙适配器
        for adapter in c.Win32_PnPEntity():
            if 'Bluetooth' in str(adapter.Name) and 'USB' not in str(adapter.Name):
                adapter_info = {
                    'name': adapter.Name,
                    'device_id': adapter.DeviceID,
                    'status': adapter.Status,
                    'pnp_class': adapter.PNPClass,
                    'manufacturer': adapter.Manufacturer
                }
                adapters.append(adapter_info)
        
        return adapters
    except ImportError:
        print("请先安装 pywin32: pip install pywin32")
        return []
    except Exception as e:
        return [f"Error: {str(e)}"]

# 安装依赖
# pip install pywin32

# 使用
adapters = get_bluetooth_adapters_win32()
for adapter in adapters:
    print(f"名称: {adapter['name']}")
    print(f"设备ID: {adapter['device_id']}")
    print(f"状态: {adapter['status']}")
    print("-" * 50)