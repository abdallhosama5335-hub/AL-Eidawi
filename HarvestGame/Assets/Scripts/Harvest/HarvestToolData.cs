using UnityEngine;

[CreateAssetMenu(fileName = "HarvestTool", menuName = "Game/Harvest Tool")]
public class HarvestToolData : ScriptableObject
{
    public string toolName = "منجل دوار";
    public GameObject toolPrefab;        // شكل الأداة (غيّره لتغيير الشكل)
    public float cutRadius = 2.5f;       // 0 = استخدام الإعداد العام
    public float rotationSpeed = 720f;   // سرعة دوران الشفرات
    public float cutInterval = 0.1f;     // الفاصل بين كل قطع
}
